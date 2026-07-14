export class ApiRequestError extends Error {
  constructor(code, message, status) {
    super(message);

    this.name = "ApiRequestError";
    this.code = code;
    this.status = status;
  }
}

export class ApiResponseValidationError extends Error {
  constructor(message, responseBody) {
    super(message);

    this.name = "ApiResponseValidationError";
    this.responseBody = responseBody;
  }
}