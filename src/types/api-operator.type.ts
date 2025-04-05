import { ApiOperationOptions } from "@nestjs/swagger";

/**
 * Type for defining API operations
 * @template M Controller method key type
 */
export type ApiOperator<M extends string> = {
  [key in Capitalize<M>]: (
    apiOperationOptions: Required<Pick<ApiOperationOptions, "summary">> & ApiOperationOptions
  ) => PropertyDecorator;
};
