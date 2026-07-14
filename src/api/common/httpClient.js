export const DEFAULT_API_BASE_URL = "/api/v1";

async function parseResponseBody(response) {
  const responseText = await response.text();

  if (!responseText) {
    return null;
  }

  try {
    return JSON.parse(responseText);
  } catch {
    // JSON이 아닌 오류 응답도 상위 계층에서 확인할 수 있도록 원문을 보존한다.
    return responseText;
  }
}

export function createHttpClient(
  baseUrl = DEFAULT_API_BASE_URL,
) {
  async function request(
    path,
    {
      method = "GET",
      body,
      accessToken,
      signal,
    } = {},
  ) {
    const headers = new Headers();

    if (body !== undefined) {
      headers.set("Content-Type", "application/json");
    }

    if (accessToken) {
      headers.set(
        "Authorization",
        `Bearer ${accessToken}`,
      );
    }

    const response = await fetch(
      `${baseUrl}${path}`,
      {
        method,
        headers,
        body:
          body === undefined
            ? undefined
            : JSON.stringify(body),
        signal,
      },
    );

    // HTTP 성공 여부는 응답 스키마와 함께 parser 계층에서 일관되게 판별한다.
    return {
      status: response.status,
      body: await parseResponseBody(response),
    };
  }

  function get(path, options) {
    return request(path, {
      ...options,
      method: "GET",
    });
  }

  function post(path, options) {
    return request(path, {
      ...options,
      method: "POST",
    });
  }

  function patch(path, options) {
    return request(path, {
      ...options,
      method: "PATCH",
    });
  }

  function deleteRequest(path, options) {
    return request(path, {
      ...options,
      method: "DELETE",
    });
  }

  return {
    get,
    post,
    patch,
    delete: deleteRequest,
  };
}
