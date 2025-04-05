import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
  @ApiProperty({
    description: "사용자 ID",
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: "사용자 이름",
    example: "홍길동",
  })
  name: string;
}
