import { ApiResponseOptions } from "@nestjs/swagger";

export interface ApiErrorResponse {
  name: string;
  error: string;
  description?: string;
}

/**
 * API Response Options
 *
 * @property statusKey - Status code field name in the response (when not set, status field will not be included)
 * @property wrapperKey - Data field name in the response (when not set, data field will not be included)
 */
export interface ResponseOptions extends Omit<ApiResponseOptions, "status" | "type"> {
  statusKey?: string;
  wrapperKey?: string;
}
