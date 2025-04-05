import { applyDecorators } from "@nestjs/common";
import { ErrorHttpStatusCode } from "@nestjs/common/utils/http-error-by-code.util";
import { ApiResponse } from "@nestjs/swagger";
import { ApiErrorResponse } from "../interfaces";

/**
 * Swagger 예외 응답 스키마를 생성합니다.
 * @param status HTTP 에러 상태 코드
 * @param errors 에러 목록
 * @returns 데코레이터
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
