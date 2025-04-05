import { HttpStatus, Type, applyDecorators } from "@nestjs/common";
import {
  ApiOperation,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiCookieAuth,
} from "@nestjs/swagger";
import { OperationObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import { createDetailResponse } from "../utils/create-detail-response";
import { createStatusResponse } from "../utils/create-status-response";
import { createExceptionResponse } from "../utils/create-exception-response";
import { ApiErrorResponse } from "../interfaces";

export type ApiOperationOptions = Required<Pick<Partial<OperationObject>, "summary">> &
  Partial<OperationObject>;

/**
 * API 데코레이터 빌더 클래스
 *
 * 메서드 체이닝을 통해 Swagger 데코레이터를 쉽게 구성할 수 있습니다.
 */
export class ApiDecoratorBuilder {
  private decorators: Array<MethodDecorator | PropertyDecorator> = [];

  /**
   * API 작업 정보
   * @param options API 작업 옵션
   */
  withOperation(options: ApiOperationOptions): this {
    this.decorators.push(ApiOperation(options));
    return this;
  }

  /**
   * Cookie 인증
   * @param name 토큰명
   */
  withCookieAuth(name?: string): this {
    this.decorators.push(ApiCookieAuth(name));
    return this;
  }

  /**
   * Bearer 인증
   * @param name 토큰명
   */
  withBearerAuth(name?: string): this {
    this.decorators.push(ApiBearerAuth(name));
    return this;
  }

  /**
   * 상태 응답만
   * @param status HTTP 상태 코드
   * @param key 응답 키
   */
  withStatusResponse(status: number, key: string): this {
    this.decorators.push(createStatusResponse(status, key));
    return this;
  }

  /**
   * 상세 응답
   * @param status HTTP 상태 코드
   * @param key 응답 키
   * @param type 응답 타입
   * @param options 옵션
   */
  withBodyResponse(
    status: number,
    key: string,
    type: Type | Type[],
    options: Record<string, any> = {}
  ): this {
    this.decorators.push(createDetailResponse(status, key, type, options));
    return this;
  }

  /**
   * 예외 응답
   * @param status HTTP 상태 코드
   * @param errors 에러 목록
   */
  withException(status: number, errors: ApiErrorResponse[]): this {
    this.decorators.push(createExceptionResponse(status, errors));
    return this;
  }

  /**
   * 에러 응답
   * @param responses 에러 응답 목록
   */
  withErrorResponses(errors: ApiErrorResponse[]): this {
    this.decorators.push(createExceptionResponse(HttpStatus.BAD_REQUEST, errors));
    return this;
  }

  /**
   * 인증 필요 에러 (401)
   * @param responses 에러 응답 목록
   */
  withUnauthorizedResponse(errors: ApiErrorResponse[]): this {
    this.decorators.push(createExceptionResponse(HttpStatus.UNAUTHORIZED, errors));
    return this;
  }

  /**
   * 권한 부족 에러 (403)
   * @param responses 에러 응답 목록
   */
  withForbiddenResponse(errors: ApiErrorResponse[]): this {
    this.decorators.push(createExceptionResponse(HttpStatus.FORBIDDEN, errors));
    return this;
  }

  /**
   * 리소스 없음 에러 (404)
   * @param responses 에러 응답 목록
   */
  withNotFoundResponse(errors: ApiErrorResponse[]): this {
    this.decorators.push(createExceptionResponse(HttpStatus.NOT_FOUND, errors));
    return this;
  }

  /**
   * 커스텀 데코레이터
   * @param decorator 추가할 데코레이터
   */
  withDecorator(decorator: MethodDecorator | PropertyDecorator): this {
    this.decorators.push(decorator);
    return this;
  }

  /**
   * 모든 데코레이터를 결합하여 반환
   */
  build(): PropertyDecorator {
    return applyDecorators(...this.decorators);
  }
}
