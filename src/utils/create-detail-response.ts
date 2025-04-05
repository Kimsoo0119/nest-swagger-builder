import { HttpStatus, Type, applyDecorators } from "@nestjs/common";
import { ErrorHttpStatusCode } from "@nestjs/common/utils/http-error-by-code.util";
import { ApiExtraModels, ApiProperty, ApiPropertyOptions, ApiResponse } from "@nestjs/swagger";
import { isArray } from "class-validator";

/**
 * Swagger 상세 응답 스키마를 생성합니다.
 * @param status HTTP 상태 코드
 * @param key 응답 키(unique)
 * @param type 응답 타입
 * @param options 추가 API 속성 옵션
 * @returns 데코레이터
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
