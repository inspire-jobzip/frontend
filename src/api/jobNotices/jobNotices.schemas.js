import { z } from "zod";

import {
  apiFailureResponseSchema,
} from "../auth/auth.schemas";
import {
  JOB_NOTICE_EXPERIENCE_LEVELS,
  JOB_NOTICE_JOB_ROLES,
} from "./jobNotices.constants";

export const jobNoticeJobRoleSchema =
  z.enum(JOB_NOTICE_JOB_ROLES);

export const jobNoticeExperienceLevelSchema =
  z.enum(JOB_NOTICE_EXPERIENCE_LEVELS);

const localDateTimeSchema = z
  .string()
  .refine(
    (value) => !Number.isNaN(Date.parse(value)),
    "올바른 날짜와 시간 형식이 아닙니다.",
  );

export const jobNoticeSchema = z.object({
  jobNoticeId: z.number().int().positive(),
  companyName: z.string(),
  title: z.string(),
  jobCategory: jobNoticeJobRoleSchema,
  locationText: z.string().nullable(),
  experienceLevel:
    jobNoticeExperienceLevelSchema,
  employmentType: z.string().nullable(),
  deadlineAt: localDateTimeSchema.nullable(),
  skillNames: z.array(z.string()),
  isBookmarked: z.boolean(),
});

export const jobNoticePageSchema = z.object({
  content: z.array(jobNoticeSchema),
  page: z.number().int().nonnegative(),
  size: z.number().int().nonnegative(),
  totalElements: z.number().int().nonnegative(),
});

export const jobNoticeListResponseSchema =
  z.discriminatedUnion("success", [
    z.object({
      success: z.literal(true),
      data: jobNoticePageSchema,
      message: z.string().optional(),
    }),
    apiFailureResponseSchema,
  ]);