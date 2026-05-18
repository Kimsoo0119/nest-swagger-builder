import { Type } from "@nestjs/common";
import { ApiResponseOptions } from "@nestjs/swagger";

export interface ApiErrorResponse {
  /**
   * Swagger UI examples 의 라벨 key. 미지정 시 `error` 값을 fallback 으로 사용합니다.
   */
  name?: string;
  error: string;
  description?: string;
}

export interface ExtraFieldOptions {
  type: 'string' | 'number' | 'boolean' | Type | [Type];
  example?: any;
}

/**
 * API Response Options
 *
 * @property statusKey - Status code field name in the response (when not set, status field will not be included)
 * @property wrapperKey - Data field name in the response (when not set, data field will not be included)
 * @property extraFields - Additional fields to include in the response schema
 */
export interface ResponseOptions extends Omit<ApiResponseOptions, "status" | "type"> {
  statusKey?: string;
  wrapperKey?: string;
  extraFields?: Record<string, ExtraFieldOptions>;
}
