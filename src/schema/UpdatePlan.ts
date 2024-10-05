import { NextFunction, Request, Response } from "express";
import Joi, { ObjectSchema } from "joi";
import { validateRequest } from "../middleware/validateRequest";
import { CreatePlanSchema } from "./CreatePlan";

const UpdatePlanSchema: ObjectSchema = CreatePlanSchema.keys({
  planId: Joi.string().required().label("Plan Id"),
});

const ValidateUpdatePlan = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateRequest(req, res, next, UpdatePlanSchema);
};

export { ValidateUpdatePlan };
