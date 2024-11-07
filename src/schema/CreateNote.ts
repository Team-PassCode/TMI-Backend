// import { NextFunction, Request, Response } from "express";
// import Joi, { ObjectSchema } from "joi";
// import { validateRequest } from "../middleware/validateRequest";

// const CreateNoteSchema: ObjectSchema = Joi.object({
//   notes: Joi.string().required().label("Notes"),
//   planId: Joi.string().required().label("Plan Id"),
// });

// const ValidateCreateNote = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   validateRequest(req, res, next, CreateNoteSchema);
// };

// export { ValidateCreateNote, CreateNoteSchema };
import { z } from "zod";
import { Request, Response, NextFunction } from "express";

const CreateNoteSchema = z.object({
  notes: z.string({required_error:"Notes is required"}).nonempty("Notes is required"),
  planId: z.string().nonempty("Plan Id is required"),
});

type CreateNoteType = z.infer<typeof CreateNoteSchema>;

const ValidateCreateNote = (req: Request, res: Response, next: NextFunction) =>{
  try {
    CreateNoteSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
       res.status(400).json({ errors: error.errors });
    }
     res.status(500).json({ message: "Internal server error" });
  }
};

export { ValidateCreateNote, CreateNoteSchema, CreateNoteType };

