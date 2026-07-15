import { z } from "zod";

import {
  apiFailureResponseSchema,
} from "../auth/auth.schemas";

const localDateTimeSchema = z
  .string()
  .refine(
    (value) => !Number.isNaN(Date.parse(value)),
    "올바른 날짜와 시간 형식이 아닙니다.",
  );

export const calendarEventSchema = z.object({
  bookmarkId: z.number().int().positive().optional(),
  jobNoticeId: z.number().int().positive(),
  companyName: z.string(),
  title: z.string(),
  deadlineAt: localDateTimeSchema,
  eventType: z.string().optional(),
  recruitStatus: z.string(),
  recruitStatusText: z.string(),
  // 현재 백엔드는 상태를 내려주며, 아래 파생 필드는 이전 응답과의 호환용이다.
  daysUntilDeadline: z.number().int().nullable().optional(),
  colorType: z.string().optional(),
});

export const calendarSummarySchema = z.object({
  openCount: z.number().int().nonnegative(),
  closingSoonCount: z.number().int().nonnegative(),
  closedCount: z.number().int().nonnegative(),
});

const calendarDataSchema = z.object({
  year: z.number().int(),
  month: z.number().int().min(1).max(12),
  summary: calendarSummarySchema.optional(),
  events: z.array(calendarEventSchema),
});

export const calendarResponseSchema =
  z.discriminatedUnion("success", [
    z.object({
      success: z.literal(true),
      data: calendarDataSchema,
      message: z.string().nullable().optional(),
    }),
    apiFailureResponseSchema,
  ]);
