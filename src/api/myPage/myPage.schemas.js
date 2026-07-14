import { z } from "zod";

import {
  apiFailureResponseSchema,
  careerStatusSchema,
  desiredJobRoleSchema,
} from "../auth/auth.schemas";

const localDateTimeSchema = z
  .string()
  .refine(
    (value) => !Number.isNaN(Date.parse(value)),
    "올바른 날짜와 시간 형식이 아닙니다.",
  );

export const myPageProfileSchema = z.object({
  userId: z.number().int().positive(),
  email: z.string().email(),
  desiredJobRole: desiredJobRoleSchema,
  careerStatus: careerStatusSchema,
  careerYears: z.number().nonnegative(),
  preferredSkillNames: z.array(z.string()),
});

export const myPageBookmarkSchema = z.object({
  bookmarkId: z.number().int().positive(),
  jobNoticeId: z.number().int().positive(),
  companyName: z.string(),
  title: z.string(),
  recruitStatus: z.string(),
  recruitStatusText: z.string(),
  deadlineAt: localDateTimeSchema.nullable(),
  daysUntilDeadline: z.number().int().nullable(),
});

export const myPageResumeSchema = z.object({
  resumeId: z.number().int().positive(),
  title: z.string(),
  isDefault: z.boolean(),
  updatedAt: localDateTimeSchema,
});

export const myPageDataSchema = z.object({
  profile: myPageProfileSchema,
  bookmarks: z.array(myPageBookmarkSchema),
  resumes: z.array(myPageResumeSchema),
});

export const updatedProfileSchema =
  myPageProfileSchema.omit({ email: true });

const bookmarkDeleteDataSchema = z.object({
  jobNoticeId: z.number().int().positive(),
  isBookmarked: z.boolean(),
});

function createDataResponseSchema(dataSchema) {
  return z.discriminatedUnion("success", [
    z.object({
      success: z.literal(true),
      data: dataSchema,
      message: z.string().nullable().optional(),
    }),
    apiFailureResponseSchema,
  ]);
}

export const myPageResponseSchema =
  createDataResponseSchema(myPageDataSchema);

export const updateProfileResponseSchema =
  createDataResponseSchema(updatedProfileSchema);

export const bookmarkDeleteResponseSchema =
  createDataResponseSchema(
    bookmarkDeleteDataSchema,
  );

export const resumeDeleteResponseSchema =
  z.discriminatedUnion("success", [
    z.object({
      success: z.literal(true),
      message: z.string(),
    }),
    apiFailureResponseSchema,
  ]);
