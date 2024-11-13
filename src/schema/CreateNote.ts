import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { validateRequest } from "../middleware/validateRequest";

const CreateNoteSchema = z.object({
  notes: z.string().nonempty("notes is required"),
  planId: z.string().nonempty("planId is required"),
});

type CreateNoteType = z.infer<typeof CreateNoteSchema>;

const ValidateCreateNote = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateRequest(req, res, next, CreateNoteSchema);
};

export { ValidateCreateNote, CreateNoteSchema, CreateNoteType };
