import { z } from "zod";

import {
  apiFailureResponseSchema,
} from "../auth/auth.schemas";

export const skillSchema = z.object({
  skillId: z.number().int(),
  skillName: z.string(),
  category: z.string(),
});

export const skillListSchema =
  z.array(skillSchema);

export const skillListResponseSchema =
  z.discriminatedUnion("success", [
    z.object({
      success: z.literal(true),
      data: skillListSchema,
      message: z.string().nullable().optional(),
    }),
    apiFailureResponseSchema,
  ]);
