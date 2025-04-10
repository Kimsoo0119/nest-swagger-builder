import { ApiProperty } from "@nestjs/swagger";

export function defineProperty(target: any, key: string, options: any) {
  ApiProperty({ name: key, ...options })(target, key);
}
