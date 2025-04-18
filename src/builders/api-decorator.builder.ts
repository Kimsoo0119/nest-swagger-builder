import { HttpStatus, Type, applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiBearerAuth, ApiCookieAuth, ApiResponseOptions } from "@nestjs/swagger";
import { OperationObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import { createDetailResponse } from "../utils/create-detail-response";
import { createStatusResponse } from "../utils/create-status-response";
import { createExceptionResponse } from "../utils/create-exception-response";
import { createFormDataRequest } from "../utils/create-form-data-request";
import { ApiErrorResponse, ResponseOptions } from "../interfaces";

export type ApiOperationOptions = Required<Pick<Partial<OperationObject>, "summary">> &
  Partial<OperationObject>;

export interface ApiDecoratorBuilderConfig {
  wrapperKey?: string | undefined;
  statusKey?: string | undefined;
}

/**
 * API Decorator Builder Class
 *
 * Easily configure Swagger decorators using method chaining.
 */
export class ApiDecoratorBuilder {
  private decorators: Array<MethodDecorator | PropertyDecorator> = [];
  private config: ApiDecoratorBuilderConfig;

  constructor(config?: ApiDecoratorBuilderConfig) {
    this.config = config || {};

    if (new.target !== ApiDecoratorBuilder) {
      return (() => new ApiDecoratorBuilder(config)) as any;
    }
  }

  withOperation(options: ApiOperationOptions): this {
    this.decorators.push(ApiOperation(options));
    return this;
  }

  withCookieAuth(name?: string): this {
    this.decorators.push(ApiCookieAuth(name));
    return this;
  }

  withBearerAuth(name?: string): this {
    this.decorators.push(ApiBearerAuth(name));
    return this;
  }

  withFormDataRequest(key: string, fileFieldName: string, options: ApiResponseOptions = {}): this {
    this.decorators.push(createFormDataRequest(key, fileFieldName, options));
    return this;
  }

  /**
   * Return only valid values from the configured options
   * @param options Additional options
   * @returns Merged options
   */
  private getOptions<T extends Record<string, any>>(options: T = {} as T): T & ResponseOptions {
    return {
      ...options,
      ...(this.config.statusKey !== undefined && { statusKey: this.config.statusKey }),
      ...(this.config.wrapperKey !== undefined && { wrapperKey: this.config.wrapperKey }),
    } as T & ResponseOptions;
  }

  withStatusResponse(
    status: number,
    key: string,
    options: Omit<ResponseOptions, "wrapperKey"> = {}
  ): this {
    this.decorators.push(createStatusResponse(status, key, this.getOptions(options)));
    return this;
  }

  withBodyResponse(
    status: number,
    key: string,
    type: Type | Type[],
    options: ResponseOptions = {}
  ): this {
    this.decorators.push(createDetailResponse(status, key, type, this.getOptions(options)));
    return this;
  }

  withException(status: number, errors: ApiErrorResponse[]): this {
    this.decorators.push(createExceptionResponse(status, errors));
    return this;
  }

  withBadRequestResponse(errors: ApiErrorResponse[]): this {
    return this.withException(HttpStatus.BAD_REQUEST, errors);
  }

  withUnauthorizedResponse(errors: ApiErrorResponse[]): this {
    return this.withException(HttpStatus.UNAUTHORIZED, errors);
  }

  withForbiddenResponse(errors: ApiErrorResponse[]): this {
    return this.withException(HttpStatus.FORBIDDEN, errors);
  }

  withNotFoundResponse(errors: ApiErrorResponse[]): this {
    return this.withException(HttpStatus.NOT_FOUND, errors);
  }

  withDecorator(decorator: MethodDecorator | PropertyDecorator): this {
    this.decorators.push(decorator);
    return this;
  }

  build(): PropertyDecorator {
    return applyDecorators(...this.decorators);
  }
}
