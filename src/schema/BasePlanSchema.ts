import { z } from "zod";

const TimeSchema = z
  .number()
  .refine((val) => val !== undefined && val !== null, {
    message: "Time is required",
  });

const BasePlanSchema = z.object({
  title: z.string().min(1, { message: "title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  startTime: TimeSchema,
  endTime: TimeSchema,
  planReferences: z
    .array(
      z.object({
        hyperLink: z.string().nullable(),
        description: z.string().nullable(),
      })
    )
    .optional(),
  breaks: z
    .array(
      z.object({
        startTime: TimeSchema,
        endTime: TimeSchema,
      })
    )
    .optional(),
});

export { BasePlanSchema };
