import { Service } from "typedi";
import PlanDA, {
  NoteD,
  PlanBreakD,
  PlanD,
  PlanReferenceD,
} from "../DatabaseAccessLayer/plan.dal";
import { Request, Response } from "express";
import { GenerateUUID } from "../lib/commonFunctions";
import { GetPlan } from "../Model/GetPlanModel";
import { PlanReference } from "../Model/PlanReference";
import { Break } from "../Model/Break";
import { Note } from "../Model/Note";
import { BreakResponseModel } from "../Model/BreakResponseModel";
import { CreatePlanType } from "../schema/CreatePlan";
import { UpdatePlanType } from "../schema/UpdatePlan";

@Service()
export default class PlanService {
  constructor(private readonly planDA: PlanDA) {}

  GetPlanDetails = async (req: Request, res: Response) => {
    try {
      const {
        params: { planid },
        userid,
      } = req;

      const [plans, planReferences] = await this.planDA.GetPlanDetails(planid);
      if (Array.isArray(plans) && plans.length > 0)
        plans[0]["PlanReferences"] = planReferences;

      res.status(200).send({
        plans,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  };

  GetPlansOfSpecifiedDate = async (req: Request, res: Response) => {
    try {
      const {
        params: { date },
        userid,
      } = req;
      const [plans, planReferences, planBreaks, notes] =
        await this.planDA.GetPlansOfSpecifiedDate(
          new Date(parseInt(date)),
          userid ?? ""
        );
      const plansWithPlanReferences = this.GetPlan(
        plans,
        planReferences,
        planBreaks,
        notes
      );
      res.status(200).send(plansWithPlanReferences);
    } catch (error) {
      res.status(500).send(error);
    }
  };

  GetPlanList = async (req: Request, res: Response) => {
    try {
      const { userid } = req;
      const [plans, planReferences, planBreaks, notes] =
        await this.planDA.GetPlanList(userid ?? "");
      const plansWithPlanReferences = this.GetPlan(
        plans,
        planReferences,
        planBreaks,
        notes
      );
      res.status(200).send(plansWithPlanReferences);
    } catch (error) {
      res.status(500).send(error);
    }
  };

  GetPlan = (
    plans: PlanD[],
    planReferences: PlanReferenceD[],
    planBreaks: PlanBreakD[],
    notes: NoteD[]
  ) => {
    if (Array.isArray(plans)) {
      if (Array.isArray(plans)) {
        const plansWithPlanReferences = plans.map<GetPlan>(
          ({
            Plan_Id,
            Title,
            Description,
            Start_Time,
            End_Time,
            Created_On,
            Created_By,
          }) => {
            const planReferencesOfThisPlan =
              planReferences?.filter((pr) => pr.Plan_Id === Plan_Id) ?? [];
            const planBreaksOfThisPlan =
              planBreaks?.filter((pb) => pb.Plan_Id === Plan_Id) ?? [];
            const notesOfThisPlan =
              notes?.filter((note) => note.Plan_Id === Plan_Id) ?? [];

            return {
              planId: Plan_Id,
              title: Title,
              description: Description,
              startTime: new Date(Start_Time).getTime(),
              endTime: new Date(End_Time).getTime(),
              createdOn: new Date(Created_On).getTime(),
              createdBy: Created_By,
              planReferences: planReferencesOfThisPlan.map<PlanReference>(
                ({ HyperLink, Description, Plan_Reference_Id }) => {
                  return {
                    hyperLink: HyperLink,
                    description: Description,
                    planReferenceId: Plan_Reference_Id,
                  };
                }
              ),
              breaks: planBreaksOfThisPlan.map<BreakResponseModel>(
                ({ Start_Time, End_Time }) => {
                  return {
                    startTime: new Date(Start_Time).getTime(),
                    endTime: new Date(End_Time).getTime(),
                  };
                }
              ),
              notes: notesOfThisPlan.map<Note>(
                ({ Note_Id, Notes, Created_On }) => {
                  return {
                    note: Notes,
                    noteId: Note_Id,
                    createdOn: Created_On.getTime(),
                  };
                }
              ),
            };
          }
        );
        return plansWithPlanReferences;
      }
      return [];
    }
  };

  CreatePlan = async (
    request: Request<{}, {}, CreatePlanType>,
    response: Response
  ) => {
    try {
      let { title, description } = request.body;

      const { userid } = request;
      const planId = GenerateUUID();

      const {
        planBreaksToBeSaved,
        planEndTime,
        planReferencesToBeSaved,
        planStartTime,
      } = this.PrepareCreateAndUpdateData(request.body);

      await this.planDA.CreatePlan(
        planId,
        userid ?? "",
        title,
        description,
        planStartTime,
        planEndTime,
        userid ?? "",
        planReferencesToBeSaved,
        planBreaksToBeSaved
      );
      const [plans, planReferences, planBreaks, notes] =
        await this.planDA.GetPlanDetails(planId);
      const plansWithPlanReferences = this.GetPlan(
        plans,
        planReferences,
        planBreaks,
        notes
      );
      response.status(200).send(plansWithPlanReferences);
    } catch (error) {
      response.status(500).send(error);
    }
  };

  UpdatePlan = async (
    request: Request<{}, {}, UpdatePlanType>,
    response: Response
  ) => {
    try {
      let { title, description, planId } = request.body;

      const { userid } = request;

      const {
        planBreaksToBeSaved,
        planEndTime,
        planReferencesToBeSaved,
        planStartTime,
      } = this.PrepareCreateAndUpdateData(request.body);

      await this.planDA.UpdatePlan(
        planId,
        title,
        description,
        planStartTime,
        planEndTime,
        userid ?? "",
        planReferencesToBeSaved,
        planBreaksToBeSaved
      );
      const [plans, planReferences, planBreaks, notes] =
        await this.planDA.GetPlanDetails(planId);
      const plansWithPlanReferences = this.GetPlan(
        plans,
        planReferences,
        planBreaks,
        notes
      );
      if(plansWithPlanReferences?.length==0){
         response.status(400).send([{message:"no such plan Id for update"}])
          return;
        } 
      response.status(200).send({
        plansWithPlanReferences,
      });
    } catch (error) {
      response.status(500).send(error);
    }
  };

  PrepareCreateAndUpdateData(
    body: CreatePlanType | UpdatePlanType
  ) {
    let { startTime, endTime, planReferences, breaks } = body;

    let planReferencesToBeSaved: PlanReference[] = [];
    let planBreaksToBeSaved: Break[] = [];

    if (Array.isArray(planReferences)) {
      planReferencesToBeSaved = planReferences.map<PlanReference>((p) => {
        return {
          hyperLink: p?.hyperLink,
          description: p?.description,
          planReferenceId: GenerateUUID(),
        };
      });
    }
    if (Array.isArray(breaks)) {
      planBreaksToBeSaved = breaks.map<Break>(({ startTime, endTime }) => {
        return {
          startTime: new Date(startTime),
          endTime: new Date(endTime),
        };
      });
    }

    return {
      planStartTime: new Date(startTime),
      planEndTime: new Date(endTime),
      planReferencesToBeSaved,
      planBreaksToBeSaved,
    };
  }

  DeletePlan = async (request: Request, response: Response) => {
    try {
      const { planid } = request.params;
      await this.planDA.DeletePlan(planid);
      response.status(200).send();
    } catch (error) {
      response.status(500).send(error);
    }
  };
}
