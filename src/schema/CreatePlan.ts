import { NextFunction, Request, Response } from "express";
import Joi, { ObjectSchema } from "joi";
import { validateRequest } from "../middleware/validateRequest";

const VerifyEndTime = (value: number, helpers: any) => {
  const { startTime } = helpers.state.ancestors[0];
  if (new Date(value) < new Date(startTime))
    return helpers.error("any.invalid");
  return value;
};

const CreatePlanSchema: ObjectSchema = Joi.object({
  title: Joi.string().required().label("Plan Title"),
  description: Joi.string().label("Plan Description").optional().allow(""),
  startTime: Joi.number().required().label("Meeting Start Time").messages({
    "any.formaterror": "Wrong Time format",
  }),
  endTime: Joi.number()
    .required()
    .custom(VerifyEndTime)
    .label("Meeting End Time")
    .messages({
      "any.formaterror": "Wrong Time format",
    }),
  planReferences: Joi.array()
    .items(
      Joi.object({
        hyperLink: Joi.string().uri().label("Hyper Link").optional().allow(""),
        description: Joi.string().label("Description").optional().allow(""),
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
