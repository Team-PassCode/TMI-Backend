import { NextFunction, Request, Response } from "express";
import Joi, { ObjectSchema } from "joi";
import { validateRequest } from "../middleware/validateRequest";

const CreateNoteSchema: ObjectSchema = Joi.object({
  notes: Joi.string().required().label("Notes"),
  planId: Joi.string().required().label("Plan Id"),
});

const ValidateCreateNote = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateRequest(req, res, next, CreateNoteSchema);
};

export { ValidateCreateNote, CreateNoteSchema };
