import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { validateRequest } from "../middleware/validateRequest";
import { BasePlanSchema } from "./BasePlanSchema";

const VerifyEndTime = (startTime: number, endTime: number) => {
  return new Date(endTime) >= new Date(startTime);
};
const CreatePlanSchema = BasePlanSchema.refine(
  (data) => VerifyEndTime(data.startTime, data.endTime),
  {
    message: "End time must be after start time.",
    path: ["endTime"],
  }
).refine(
  (data) =>
    data.breaks
      ? data.breaks.every((breakTime) =>
          VerifyEndTime(breakTime.startTime, breakTime.endTime)
        )
      : true,
  {
    message: "Each break's end time must be after its start time.",
    path: ["breaks"],
  }
);

type CreatePlanType = z.infer<typeof CreatePlanSchema>;

const ValidateCreatePlan = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateRequest(req, res, next, CreatePlanSchema);
};

export { ValidateCreatePlan, BasePlanSchema, CreatePlanSchema, CreatePlanType };
