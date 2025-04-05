import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({
    description: "사용자 이름",
    example: "홍길동",
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: "사용자 이메일",
    example: "user@example.com",
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "비밀번호",
    example: "password123",
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: "주소 (선택사항)",
    example: "서울특별시 강남구",
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;
}
