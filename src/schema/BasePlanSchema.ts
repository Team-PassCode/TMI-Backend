import { z } from "zod";

const TimeSchema = z.number({
  message: "Sheduled On",
  required_error: "time is required",
});

const BasePlanSchema = z.object({
  title: z.string({ message: "title" }).nonempty("title is required"),
  description: z
    .string({ message: "description" })
    .nonempty("Description is required"),
  // date: Joi.number().required().label("Scheduled On"),
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
