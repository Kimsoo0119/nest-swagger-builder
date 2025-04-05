import { ApiOperationOptions } from '@nestjs/swagger';

/**
 * API 작업 정의를 위한 타입
 * @template M 컨트롤러 메서드의 키 타입
 */
export type ApiOperator<M extends string> = {
  [key in Capitalize<M>]: (
    apiOperationOptions: Required<Pick<ApiOperationOptions, 'summary'>> &
      ApiOperationOptions,
  ) => PropertyDecorator;
};
