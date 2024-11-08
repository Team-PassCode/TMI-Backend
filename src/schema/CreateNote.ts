import { z } from "zod";
import { Request, Response, NextFunction } from "express";

const CreateNoteSchema = z.object({
  notes: z.string().nonempty("notes is required"),
  planId: z.string().nonempty('planId is required'),
});

type CreateNoteType = z.infer<typeof CreateNoteSchema>;

const ValidateCreateNote = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    CreateNoteSchema.parse(req.body);
    next();
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors.map((x)=>x.message)});
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export { ValidateCreateNote, CreateNoteSchema, CreateNoteType };
