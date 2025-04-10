import { HttpStatus } from "@nestjs/common";
import { ErrorHttpStatusCode } from "@nestjs/common/utils/http-error-by-code.util";
import { ApiResponse } from "@nestjs/swagger";
import { ResponseOptions } from "../interfaces";
import { defineProperty } from "../helpers/define-property";
import { setClassName } from "../helpers/set-class-name";

/**
 * Create a Swagger status response schema
 * @param status HTTP Status Code
 * @param key Response Key (unique)
 * @param options Additional API response options
 * @returns Decorator
 */
export function createStatusResponse(
  status: Exclude<HttpStatus, ErrorHttpStatusCode>,
  key: string,
  options: Omit<ResponseOptions, "wrapperKey"> = {}
) {
  const { statusKey, ...responseOptions } = options;

  if (!statusKey) {
    return ApiResponse({
      status,
      ...responseOptions,
    });
  }

  class StatusResponseClass {}
  defineProperty(StatusResponseClass.prototype, statusKey, {
    enum: HttpStatus,
    example: status,
  });

  setClassName(StatusResponseClass, `${key[0].toUpperCase()}${key.slice(1)}StatusResponseDto`);

  return ApiResponse({
    status,
    type: StatusResponseClass,
    ...responseOptions,
  });
}
