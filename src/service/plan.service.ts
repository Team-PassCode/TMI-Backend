import { Service } from "typedi";
import PlanDA from "../DatabaseAccessLayer/plan.dal";
import { Request, Response } from "express";
import { GenerateUUID } from "../lib/commonFunctions";
import { ErrorMessage, SuccessMessage } from "../Shared/messages";
import * as dotenv from "dotenv";
import {
  CreatePlanRequestModel,
  PlanReference,
} from "../Model/CreatePlanRequestModel";
import { UpdatePlanRequestModel } from "../Model/UpdatePlanRequestModel";
dotenv.config();

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

      console.log(plans);

      res.status(200).send({
        plans,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  };

  GetPatientList = async (req: Request, res: Response) => {
    try {
      const { userid } = req;
      const [patient_list] = await this.planDA.GetPlanList(userid ?? "");

      res.status(200).send(patient_list);
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
