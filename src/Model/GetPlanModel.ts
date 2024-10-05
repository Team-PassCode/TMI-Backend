import { PlanReference } from "./PlanReference";
import { UpdatePlanRequestModel } from "./UpdatePlanRequestModel";

export interface GetPlan {
  planId: string;
  title: string;
  description: string;
  startTime: number;
  endTime: number;
  planReferences: PlanReference[];
}
