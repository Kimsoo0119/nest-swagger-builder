import { applyDecorators } from "@nestjs/common";
import { ErrorHttpStatusCode } from "@nestjs/common/utils/http-error-by-code.util";
import { ApiResponse } from "@nestjs/swagger";
import { ApiErrorResponse } from "../interfaces";

/**
 * Create a Swagger exception response schema
 * @param status HTTP Error Status Code
 * @param errors Error List
 * @returns Decorator
 */
export function createExceptionResponse(status: ErrorHttpStatusCode, errors: ApiErrorResponse[]) {
  const examples: Record<string, any> = {};

  errors.forEach(({ name, error, description }) => {
    examples[name] = { value: { status, error, description } };
  });

  return applyDecorators(
    ApiResponse({
      status,
      content: {
        "application-json": {
          examples,
        },
      },
    })
  );
}
