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
  const { statusKey, extraFields, ...responseOptions } = options;

  if (!statusKey && !extraFields) {
    return ApiResponse({
      status,
      ...responseOptions,
    });
  }

  class StatusResponseClass {}

  if (extraFields) {
    for (const [fieldKey, fieldOptions] of Object.entries(extraFields)) {
      const isFieldArray = Array.isArray(fieldOptions.type);
      const rawType = isFieldArray ? (fieldOptions.type as any[])[0] : fieldOptions.type;
      const resolvedFieldType =
        rawType === 'boolean' ? Boolean
        : rawType === 'number' ? Number
        : rawType === 'string' ? String
        : rawType;

      defineProperty(StatusResponseClass.prototype, fieldKey, {
        type: resolvedFieldType,
        ...(isFieldArray && { isArray: true }),
        ...(fieldOptions.example !== undefined && { example: fieldOptions.example }),
      });
    }
  }

  if (statusKey) {
    defineProperty(StatusResponseClass.prototype, statusKey, {
      enum: HttpStatus,
      example: status,
    });
  }

  setClassName(StatusResponseClass, `${key[0].toUpperCase()}${key.slice(1)}StatusResponseDto`);

  return ApiResponse({
    status,
    type: StatusResponseClass,
    ...responseOptions,
  });
}
