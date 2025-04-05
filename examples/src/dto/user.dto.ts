import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
  @ApiProperty({
    description: "User ID",
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: "User Name",
    example: "Kimsoo0119",
  })
  name: string;
}
