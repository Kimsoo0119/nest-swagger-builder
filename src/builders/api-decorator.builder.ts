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
import { createFormDataRequest } from "../utils/create-form-data-request";
import { ApiErrorResponse } from "../interfaces";

export type ApiOperationOptions = Required<Pick<Partial<OperationObject>, "summary">> &
  Partial<OperationObject>;

/**
 * API Decorator Builder Class
 *
 * Easily configure Swagger decorators using method chaining.
 */
export class ApiDecoratorBuilder {
  private decorators: Array<MethodDecorator | PropertyDecorator> = [];

  /**
   * API Operation Information
   * @param options API Operation Options
   */
  withOperation(options: ApiOperationOptions): this {
    this.decorators.push(ApiOperation(options));
    return this;
  }

  /**
   * Cookie Authentication
   * @param name Token Name
   */
  withCookieAuth(name?: string): this {
    this.decorators.push(ApiCookieAuth(name));
    return this;
  }

  /**
   * Bearer Authentication
   * @param name Token Name
   */
  withBearerAuth(name?: string): this {
    this.decorators.push(ApiBearerAuth(name));
    return this;
  }

  /**
   * Multipart Form Data for File Upload
   * @param key Response Key(Unique)
   * @param fileFieldName Name of the file field in form
   * @param options Options
   */
  withFormDataRequest(key: string, fileFieldName: string, options: Record<string, any> = {}): this {
    this.decorators.push(createFormDataRequest(key, fileFieldName, options));
    return this;
  }

  /**
   * Status Response Only
   * @param status HTTP Status Code
   * @param key Response Key
   */
  withStatusResponse(status: number, key: string): this {
    this.decorators.push(createStatusResponse(status, key));
    return this;
  }

  /**
   * Detailed Response
   * @param status HTTP Status Code
   * @param key Response Key(Unique)
   * @param type Response Type
   * @param options Options
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
   * Exception Response
   * @param status HTTP Status Code
   * @param errors Error List
   */
  withException(status: number, errors: ApiErrorResponse[]): this {
    this.decorators.push(createExceptionResponse(status, errors));
    return this;
  }

  /**
   * Error Response
   * @param responses Error Response List
   */
  withErrorResponses(errors: ApiErrorResponse[]): this {
    this.decorators.push(createExceptionResponse(HttpStatus.BAD_REQUEST, errors));
    return this;
  }

  /**
   * Unauthorized Error (401)
   * @param responses Error Response List
   */
  withUnauthorizedResponse(errors: ApiErrorResponse[]): this {
    this.decorators.push(createExceptionResponse(HttpStatus.UNAUTHORIZED, errors));
    return this;
  }

  /**
   * Forbidden Error (403)
   * @param responses Error Response List
   */
  withForbiddenResponse(errors: ApiErrorResponse[]): this {
    this.decorators.push(createExceptionResponse(HttpStatus.FORBIDDEN, errors));
    return this;
  }

  /**
   * Not Found Error (404)
   * @param responses Error Response List
   */
  withNotFoundResponse(errors: ApiErrorResponse[]): this {
    this.decorators.push(createExceptionResponse(HttpStatus.NOT_FOUND, errors));
    return this;
  }

  /**
   * Custom Decorator
   * @param decorator Additional Decorator
   */
  withDecorator(decorator: MethodDecorator | PropertyDecorator): this {
    this.decorators.push(decorator);
    return this;
  }

  /**
   * Combine all decorators and return
   */
  build(): PropertyDecorator {
    return applyDecorators(...this.decorators);
  }
}
