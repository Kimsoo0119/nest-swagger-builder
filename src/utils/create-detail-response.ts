import { HttpStatus, Type, applyDecorators } from "@nestjs/common";
import { ErrorHttpStatusCode } from "@nestjs/common/utils/http-error-by-code.util";
import { ApiExtraModels, ApiProperty, ApiPropertyOptions, ApiResponse } from "@nestjs/swagger";
import { isArray } from "class-validator";

/**
 * Create a detailed response schema for Swagger
 * @param status HTTP Status Code
 * @param key Response Key (unique)
 * @param type Response Type
 * @param options Additional API property options
 * @returns Decorator
 */
export function createDetailResponse(
  status: Exclude<HttpStatus, ErrorHttpStatusCode>,
  key: string,
  type: Type | Type[],
  options: Omit<ApiPropertyOptions, "name" | "type"> = {}
) {
  class DetailResponseClass {
    @ApiProperty({
      name: "status",
      example: `${status}`,
      enum: HttpStatus,
    })
    // @ts-ignore
    private readonly status!: string;

    @ApiProperty({
      name: "data",
      type,
      ...options,
    })
    // @ts-ignore
    private readonly data: string;
  }

  Object.defineProperty(DetailResponseClass, "name", {
    value: `${key[0].toUpperCase()}${key.slice(1)}ResponseDto`,
  });

  return applyDecorators(
    isArray(type) ? ApiExtraModels(...type) : ApiExtraModels(type),
    ApiResponse({ status, type: DetailResponseClass })
  );
}
