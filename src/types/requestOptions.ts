import type { StringifiableRecord } from "query-string";

export type RequestOptions = {
  method?: string;
  query?: StringifiableRecord;
  body?: unknown;
};
