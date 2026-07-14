import { z } from "zod";

import {
  apiFailureResponseSchema,
} from "../auth/auth.schemas";

const yearMonthSchema = z
  .string()
  .regex(
    /^\d{4}-(0[1-9]|1[0-2])$/,
    "연월은 YYYY-MM 형식으로 입력해 주세요.",
  );

const optionalTextSchema = z
  .string()
  .nullable();

const optionalUrlSchema = z
  .string()
  .url("올바른 URL을 입력해 주세요.")
  .nullable();

export const employmentTypeSchema = z.enum([
  "FULL_TIME",
  "CONTRACT",
  "INTERN",
  "FREELANCER",
]);

export const resumeEducationSchema = z.object({
  schoolName: z.string().trim().min(
    1,
    "학교명을 입력해 주세요.",
  ),
  major: optionalTextSchema,
  status: z.string().trim().min(
    1,
    "학적 상태를 선택해 주세요.",
  ),
  startYearMonth: yearMonthSchema.nullable(),
  endYearMonth: yearMonthSchema.nullable(),
});

export const resumeExperienceSchema = z
  .object({
    companyName: z.string().trim().min(
      1,
      "회사명을 입력해 주세요.",
    ),
    roleName: z.string().trim().min(
      1,
      "직무·직책을 입력해 주세요.",
    ),
    employmentType: employmentTypeSchema,
    startYearMonth: yearMonthSchema,
    endYearMonth: yearMonthSchema.nullable(),
    isCurrent: z.boolean(),
    responsibilities: optionalTextSchema,
    sortOrder: z.number().int().positive(),
  })
  .superRefine((experience, context) => {
    if (
      !experience.isCurrent &&
      !experience.endYearMonth
    ) {
      context.addIssue({
        code: "custom",
        path: ["endYearMonth"],
        message:
          "현재 재직 중이 아니면 퇴사 연월을 입력해 주세요.",
      });
    }

    if (
      experience.endYearMonth &&
      experience.endYearMonth <
        experience.startYearMonth
    ) {
      context.addIssue({
        code: "custom",
        path: ["endYearMonth"],
        message:
          "퇴사 연월은 입사 연월보다 빠를 수 없습니다.",
      });
    }
  });

export const resumeProjectRequestSchema = z.object({
  projectName: z.string().trim().min(
    1,
    "프로젝트명을 입력해 주세요.",
  ),
  roleName: optionalTextSchema,
  startYearMonth: yearMonthSchema.nullable(),
  endYearMonth: yearMonthSchema.nullable(),
  description: optionalTextSchema,
  troubleshooting: optionalTextSchema,
  techStacks: z.array(z.string()),
  sortOrder: z.number().int().positive(),
});

export const resumeRequestSchema = z.object({
  title: z.string().trim().min(
    1,
    "이력서 제목을 입력해 주세요.",
  ),
  name: z.string().trim().min(
    1,
    "이름을 입력해 주세요.",
  ),
  email: z
    .string()
    .trim()
    .email("올바른 이메일을 입력해 주세요."),
  phone: optionalTextSchema,
  githubUrl: optionalUrlSchema,
  blogUrl: optionalUrlSchema,
  summaryText: optionalTextSchema,
  education: z.array(resumeEducationSchema),
  experience: z.array(resumeExperienceSchema),
  resumeSkillNames: z.array(z.string()),
  motivationText: optionalTextSchema,
  strengthsAndWeaknessesText:
    optionalTextSchema,
  isDefault: z.boolean(),
});

const createdResumeSchema = z.object({
  resumeId: z.number().int().positive(),
  title: z.string(),
  isDefault: z.boolean(),
});

const createdProjectSchema = z.object({
  resumeProjectId: z.number().int().positive(),
  resumeId: z.number().int().positive(),
  projectName: z.string(),
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

export const createResumeResponseSchema =
  createDataResponseSchema(createdResumeSchema);

export const createResumeProjectResponseSchema =
  createDataResponseSchema(createdProjectSchema);
