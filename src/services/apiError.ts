import type { ApiErrorBody } from "../types/apiErrorBody";
import type { FieldError } from "../types/fieldError";

export class ApiError extends Error {
  public readonly status: number;
  public readonly title: string;
  public readonly detail: string;
  public readonly instance: string;
  public readonly code: string;
  public readonly errors: FieldError[] | null;

  constructor(apiErrorBody: ApiErrorBody) {
    super(apiErrorBody.detail);
    this.status = apiErrorBody.status;
    this.title = apiErrorBody.title;
    this.detail = apiErrorBody.detail;
    this.instance = apiErrorBody.instance;
    this.code = apiErrorBody.code;
    this.errors = apiErrorBody.errors;
  }
}