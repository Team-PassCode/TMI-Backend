import { Service } from "typedi";
import PlanDA from "../DatabaseAccessLayer/plan.dal";
import { Request, Response } from "express";
import { GenerateUUID } from "../lib/commonFunctions";
import { SuccessMessage } from "../Shared/messages";
import { CreatePlanRequestModel } from "../Model/CreatePlanRequestModel";
import { UpdatePlanRequestModel } from "../Model/UpdatePlanRequestModel";
import { GetPlan } from "../Model/GetPlanModel";
import { PlanReference } from "../Model/PlanReference";

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

  GetPlanList = async (req: Request, res: Response) => {
    try {
      const { userid } = req;
      const [plans, planReferences] = await this.planDA.GetPlanList(
        userid ?? ""
      );

      if (Array.isArray(plans) && plans.length > 0) {
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
              planReferences?.filter((pr: any) => pr.Plan_Id === Plan_Id) ?? [];

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
            };
          }
        );
        res.status(200).send(plansWithPlanReferences);
      } else {
        res.status(200).send([]);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  };

  CreatePlan = async (
    request: Request<{}, {}, CreatePlanRequestModel>,
    response: Response
  ) => {
    try {
      let { title, description, startTime, endTime, planReferences } =
        request.body;

      const { userid } = request;
      const planId = GenerateUUID();
      let planReferencesToBeSaved: PlanReference[] = [];

      if (Array.isArray(planReferences) && planReferences.length > 0) {
        planReferencesToBeSaved = planReferences.map<PlanReference>((p) => {
          return {
            hyperLink: p.hyperLink,
            description: p.description,
            planReferenceId: GenerateUUID(),
          };
        });
      }

      await this.planDA.CreatePlan(
        planId,
        userid ?? "",
        title,
        description,
        new Date(startTime),
        new Date(endTime),
        planReferencesToBeSaved,
        userid ?? ""
      );
      response.status(200).send({
        status: SuccessMessage.Success,
      });
    } catch (error) {
      console.log(error);
      response.status(500).send(error);
    }
  };

  UpdatePlan = async (
    request: Request<{}, {}, UpdatePlanRequestModel>,
    response: Response
  ) => {
    try {
      let { title, description, startTime, endTime, planReferences, planId } =
        request.body;

      const { userid } = request;
      let planReferencesToBeSaved: PlanReference[] = [];

      if (Array.isArray(planReferences) && planReferences.length > 0) {
        planReferencesToBeSaved = planReferences.map<PlanReference>((p) => {
          return {
            hyperLink: p.hyperLink,
            description: p.description,
            planReferenceId: GenerateUUID(),
          };
        });
      }

      await this.planDA.UpdatePlan(
        planId,
        title,
        description,
        new Date(startTime),
        new Date(endTime),
        planReferencesToBeSaved,
        userid ?? ""
      );
      response.status(200).send({
        status: SuccessMessage.Success,
      });
    } catch (error) {
      console.log(error);
      response.status(500).send(error);
    }
  };
}
