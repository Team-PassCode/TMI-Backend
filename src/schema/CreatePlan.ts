import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const VerifyEndTime = (startTime: number, endTime: number) => {
  return new Date(endTime) >= new Date(startTime);
};

const TimeSchema = z.number({message: "Sheduled On",required_error:"time is required"});

const BasePlanSchema = z.object({
  title: z.string({ message: "title" }).nonempty("title is required"),
  description: z.string({message: "description"}).nonempty("Description is required"),
  // date: Joi.number().required().label("Scheduled On"),
  startTime: TimeSchema,
  endTime: TimeSchema,
  planReferences: z.array(
    z.object({
        hyperLink: z.string().nullable(),
        description: z.string().nullable(),
      })
  ).optional(),
  breaks: z.array(
      z.object({
        startTime: TimeSchema,
        endTime: TimeSchema,
      })
    ).optional()
});

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
  try {
    CreatePlanSchema.parse(req.body);
    next();
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors.map((x)=>x.message)});
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export { ValidateCreatePlan, BasePlanSchema, CreatePlanSchema, CreatePlanType };
