import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiPropertyOptions } from "@nestjs/swagger";
import { defineProperty } from "../helpers/define-property";
import { setClassName } from "../helpers/set-class-name";

/**
 * Create a multipart form data decorator for file uploads in Swagger
 * @param key Response Key (unique)
 * @param fileFieldName The name of the file field in the form
 * @param options Additional API property options
 * @returns Decorator
 */
export function createFormDataRequest(
  key: string,
  fileFieldName: string,
  options: Omit<ApiPropertyOptions, "name" | "type"> = {}
) {
  class FileRequestDto {}
  defineProperty(FileRequestDto.prototype, fileFieldName, {
    format: "binary",
    type: "string",
    ...options,
  });

  setClassName(FileRequestDto, `${key[0].toUpperCase()}${key.slice(1)}RequestDto`);

  return applyDecorators(
    ApiConsumes("multipart/form-data"),
    ApiBody({
      type: FileRequestDto,
    })
  );
}
