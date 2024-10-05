import { PlanReference } from "./PlanReference";

export interface UpdatePlanRequestModel {
  planId: string;
  title: string;
  description: string;
  startTime: number;
  endTime: number;
  planReferences?: PlanReference[];
  breaks?: number[];
  breakDuration?: string;
}
