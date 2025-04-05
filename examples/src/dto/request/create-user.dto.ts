import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({
    description: "User Name",
    example: "Kimsoo0119",
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: "User Email",
    example: "user@example.com",
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Password",
    example: "password123",
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: "Address (Optional)",
    example: "Seoul, Korea",
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;
}
