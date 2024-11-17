import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { validateRequest } from "../middleware/validateRequest";

const CreateNoteSchema = z.object({
  notes: z.string().min(1, "notes is required"),
  planId: z.string().min(1, "planId is required"),
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
