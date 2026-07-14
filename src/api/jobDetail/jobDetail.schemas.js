import { z } from "zod";

import {
  apiFailureResponseSchema,
} from "../auth/auth.schemas";

const nullableText = z.string().nullable();
const analysisItemsSchema = z
  .array(z.string())
  .nullish()
  .transform((items) => items ?? []);

const jobDetailSchema = z.object({
  jobNoticeId: z.number().int().positive(),
  externalNoticeId: nullableText.optional(),
  companyName: z.string(),
  title: z.string(),
  sourceUrl: nullableText,
  jobCategory: nullableText,
  locationText: nullableText,
  experienceLevel: nullableText,
  employmentType: nullableText,
  educationLevel: nullableText,
  salaryText: nullableText,
  deadlineAt: nullableText,
  roleKeywordsText: nullableText,
  descriptionRaw: nullableText,
  skillNames: z.array(z.string()),
  isBookmarked: z.boolean(),
  jaccardScore: z.number(),
});

const jobAnalysisSchema = z.object({
  jobNoticeId: z.number().int().positive(),
  cached: z.boolean(),
  aiAnalysis: z.object({
    // 기존에 저장된 ai_analysis_json에는 일부 필드나 분석 시각이
    // 없을 수 있다. 표시 가능한 분석까지 응답 전체와 함께 버리지 않는다.
    taskSummary: analysisItemsSchema,
    requiredSkills: analysisItemsSchema,
    possibleTasks: analysisItemsSchema,
    analyzedAt: z.string().nullish().transform((value) => value ?? ""),
  }),
});

const aiRecommendationSchema = z.object({
  aiRecommendationId: z.number().int().nonnegative(),
  userId: z.number().int().positive(),
  jobNoticeId: z.number().int().positive(),
  resumeId: z.number().int().positive(),
  feedbackText: z.string(),
  missingKeywords: z.array(z.string()),
  recommendedProjectTitle: z.string(),
  recommendedProjectDescription: z.string(),
  modelName: z.string().nullable(),
  createdAt: z.string(),
});

function createDataResponseSchema(dataSchema) {
  return z.discriminatedUnion("success", [
    z.object({
      success: z.literal(true),
      data: dataSchema,
      message: z.string().nullable().optional(),
      error: z.null().optional(),
    }),
    apiFailureResponseSchema,
  ]);
}

export const jobDetailResponseSchema =
  createDataResponseSchema(jobDetailSchema);

export const jobAnalysisResponseSchema =
  createDataResponseSchema(jobAnalysisSchema);

export const aiRecommendationResponseSchema =
  createDataResponseSchema(aiRecommendationSchema);
