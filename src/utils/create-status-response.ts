import { HttpStatus, applyDecorators } from "@nestjs/common";
import { ErrorHttpStatusCode } from "@nestjs/common/utils/http-error-by-code.util";
import { ApiProperty, ApiResponse } from "@nestjs/swagger";

/**
 * Create a Swagger status response schema
 * @param status HTTP Status Code
 * @param key Response Key (unique)
 * @returns Decorator
 */
export function createStatusResponse(
  status: Exclude<HttpStatus, ErrorHttpStatusCode>,
  key: string
) {
  class StatusResponseClass {
    @ApiProperty({
      name: "status",
      example: `${status}`,
      enum: HttpStatus,
    })
    // @ts-ignore
    private readonly status!: string;
  }

  Object.defineProperty(StatusResponseClass, "name", {
    value: `${key[0].toUpperCase()}${key.slice(1)}StatusDto`,
  });

  return applyDecorators(ApiResponse({ status, type: StatusResponseClass }));
}
