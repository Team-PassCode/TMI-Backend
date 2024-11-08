import { NextFunction, Request, Response } from "express";
import { BasePlanSchema } from "./CreatePlan";
import { z } from "zod";

const UpdatePlanSchema = BasePlanSchema.extend({
  planId: z.string({ message: "plan id" }).nonempty("planid is required"),
});

type UpdatePlanType = z.infer<typeof UpdatePlanSchema>;

const ValidateUpdatePlan = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    UpdatePlanSchema.parse(req.body);
    next;
  } catch (error:any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors.map((x)=>x.message)});
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export { ValidateUpdatePlan, UpdatePlanType };
