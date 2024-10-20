import { NextFunction, Request, Response } from "express";
import Joi, { ObjectSchema } from "joi";
import { validateRequest } from "../middleware/validateRequest";

const VerifyEndTime = (value: number, helpers: any) => {
  const { startTime } = helpers.state.ancestors[0];
  if (new Date(value) < new Date(startTime))
    return helpers.error("any.invalid");
  return value;
};

const TimeSchema = Joi.number().required().label("Scheduled On");

const CreatePlanSchema: ObjectSchema = Joi.object({
  title: Joi.string().required().label("Plan Title"),
  description: Joi.string().label("Plan Description").optional().allow(""),
  // date: Joi.number().required().label("Scheduled On"),
  startTime: TimeSchema,
  endTime: TimeSchema.custom(VerifyEndTime),
  planReferences: Joi.array()
    .items(
      Joi.object({
        hyperLink: Joi.string().uri().label("Hyper Link").optional().allow(""),
        description: Joi.string().label("Description").optional().allow(""),
      })
    )
    .optional(),
  breaks: Joi.array()
    .items(
      Joi.object({
        startTime: TimeSchema,
        endTime: TimeSchema.custom(VerifyEndTime),
      })
    )
    .optional(),
});

const ValidateCreatePlan = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateRequest(req, res, next, CreatePlanSchema);
};

export { ValidateCreatePlan, CreatePlanSchema };
