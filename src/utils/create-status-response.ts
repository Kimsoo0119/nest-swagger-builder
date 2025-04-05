import { HttpStatus, applyDecorators } from "@nestjs/common";
import { ErrorHttpStatusCode } from "@nestjs/common/utils/http-error-by-code.util";
import { ApiProperty, ApiResponse } from "@nestjs/swagger";

/**
 * Swagger 상태 응답 스키마를 생성합니다.
 * @param status HTTP 상태 코드
 * @param key 응답 키(unique)
 * @returns 데코레이터
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
