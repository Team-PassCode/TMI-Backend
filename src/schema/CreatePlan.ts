import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { validateRequest } from "../middleware/validateRequest";
import { BasePlanSchema } from "./BasePlanSchema";

const VerifyEndTime = (startTime: number, endTime: number) => {
  return new Date(endTime) >= new Date(startTime);
};

const verifyStartTime = (startTime: number) => {
  return startTime > 0 && !isNaN(new Date(startTime).getTime());
};
const CreatePlanSchema = BasePlanSchema.refine(
  (data) => verifyStartTime(data.startTime),
  {
    message: "Put a valid Start Time.",
    path: ["startTime"],
  }
)
  .refine((data) => VerifyEndTime(data.startTime, data.endTime), {
    message: "End Time must be after start time.",
    path: ["endTime"],
  })
  .refine(
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
  )
  .refine(
    (data) =>
      data.breaks
        ? data.breaks.every((breakTime) => verifyStartTime(breakTime.startTime))
        : true,
    {
      message: "Put a Valid Break Start Time",
      path: ["endTime"],
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
