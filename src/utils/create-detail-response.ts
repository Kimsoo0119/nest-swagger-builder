import { HttpStatus, Type, applyDecorators } from "@nestjs/common";
import { ErrorHttpStatusCode } from "@nestjs/common/utils/http-error-by-code.util";
import { ApiExtraModels, ApiResponse } from "@nestjs/swagger";
import { isArray } from "class-validator";
import { ResponseOptions } from "../interfaces";
import { defineProperty } from "../helpers/define-property";
import { setClassName } from "../helpers/set-class-name";

/** 클래스 이름을 동적으로 지정 */

export function createDetailResponse(
  status: Exclude<HttpStatus, ErrorHttpStatusCode>,
  key: string,
  type: Type | Type[],
  options: ResponseOptions = {}
) {
  const { wrapperKey, statusKey, ...responseOptions } = options;
  const isTypeArray = isArray(type);
  const resolvedType = isTypeArray ? type[0] : type;

  if (!wrapperKey && !statusKey) {
    return applyDecorators(
      isTypeArray ? ApiExtraModels(...type) : ApiExtraModels(type),
      ApiResponse({
        status,
        type: isTypeArray ? [resolvedType] : resolvedType,
        ...responseOptions,
      })
    );
  }

  class DetailResponseClass {}

  if (statusKey) {
    defineProperty(DetailResponseClass.prototype, statusKey, {
      enum: HttpStatus,
      example: status,
    });

    if (!wrapperKey) {
      defineProperty(DetailResponseClass.prototype, "data", {
        type,
      });
    }
  }

  if (wrapperKey) {
    defineProperty(DetailResponseClass.prototype, wrapperKey, {
      type,
    });
  }

  setClassName(DetailResponseClass, `${key[0].toUpperCase()}${key.slice(1)}ResponseDto`);

  const extraModels = isTypeArray ? ApiExtraModels(...type) : ApiExtraModels(type);

  return applyDecorators(
    extraModels,
    ApiResponse({ status, type: DetailResponseClass, ...responseOptions })
  );
}
