export interface UpdatePlanRequestModel {
  planId: string;
  title: string;
  description: string;
  startTime: number;
  endTime: number;
  planReferences: PlanReference[];
  breaks: number[];
  breakDuration: string;
}

export interface PlanReference {
  hyperLink: string;
  description: string;
}
