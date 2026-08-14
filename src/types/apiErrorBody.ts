import type { FieldError } from "./fieldError";

export interface ApiErrorBody {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  code: string;
  errors: FieldError[] | null;
}