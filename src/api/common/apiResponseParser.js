import {
  ApiRequestError,
  ApiResponseValidationError,
} from "./apiError";

export function parseApiDataResponse(
  response,
  responseSchema,
) {
  const parsedResponse = responseSchema.safeParse(
    response.body,
  );

  // 서버 응답 계약 위반은 일반적인 API 요청 실패와 구분한다.
  if (!parsedResponse.success) {
    throw new ApiResponseValidationError(
      "API 응답 형식이 명세와 일치하지 않습니다.",
      response.body,
    );
  }

  if (!parsedResponse.data.success) {
    throw new ApiRequestError(
      parsedResponse.data.error.code,
      parsedResponse.data.error.message,
      response.status,
    );
  }

  return parsedResponse.data.data;
}

export function parseApiMessageResponse(
  response,
  responseSchema,
) {
  const parsedResponse = responseSchema.safeParse(
    response.body,
  );

  if (!parsedResponse.success) {
    throw new ApiResponseValidationError(
      "API 응답 형식이 명세와 일치하지 않습니다.",
      response.body,
    );
  }

  if (!parsedResponse.data.success) {
    throw new ApiRequestError(
      parsedResponse.data.error.code,
      parsedResponse.data.error.message,
      response.status,
    );
  }

  return {
    message: parsedResponse.data.message,
  };
}