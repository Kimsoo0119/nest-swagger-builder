import { Type, applyDecorators } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiProperty, ApiPropertyOptions } from "@nestjs/swagger";

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
  class FileRequestDto {
    @ApiProperty({
      name: fileFieldName,
      format: "binary",
      type: "string",
      ...options,
    })
    // @ts-ignore
    private readonly file: string;
  }

  Object.defineProperty(FileRequestDto, "name", {
    value: `${key[0].toUpperCase()}${key.slice(1)}RequestDto`,
  });

  return applyDecorators(
    ApiConsumes("multipart/form-data"),
    ApiBody({
      type: FileRequestDto,
    })
  );
}
