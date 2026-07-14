import { z } from "zod";

import {
  CAREER_STATUSES,
  DESIRED_JOB_ROLES,
} from "./auth.constants";

export const desiredJobRoleSchema =
  z.enum(DESIRED_JOB_ROLES);

export const careerStatusSchema =
  z.enum(CAREER_STATUSES);

export const apiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
});

export const apiFailureResponseSchema = z.object({
  success: z.literal(false),
  error: apiErrorSchema,
});

export const loginDataSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: z.object({
    userId: z.number().int(),
    email: z.string().email(),
    desiredJobRole: desiredJobRoleSchema,
    careerStatus: careerStatusSchema,
  }),
});

export const signupDataSchema = z.object({
  userId: z.number().int(),
  email: z.string().email(),
  desiredJobRole: desiredJobRoleSchema,
  careerStatus: careerStatusSchema,
  careerYears: z.number(),
  preferredSkillNames: z.array(z.string()),
});

export const tokenDataSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

function createApiDataResponseSchema(dataSchema) {
  return z.discriminatedUnion("success", [
    z.object({
      success: z.literal(true),
      data: dataSchema,
      message: z.string().nullable().optional(),
    }),
    apiFailureResponseSchema,
  ]);
}

export const loginResponseSchema =
  createApiDataResponseSchema(loginDataSchema);

export const signupResponseSchema =
  createApiDataResponseSchema(signupDataSchema);

export const refreshTokenResponseSchema =
  createApiDataResponseSchema(tokenDataSchema);

export const logoutResponseSchema =
  z.discriminatedUnion("success", [
    z.object({
      success: z.literal(true),
      message: z.string(),
    }),
    apiFailureResponseSchema,
  ]);
