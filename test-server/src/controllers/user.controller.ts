import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from "@nestjs/common";
import { CreateUserDto } from "../dto/request/create-user.dto.js";
import { ApiTags } from "@nestjs/swagger";
import {} from "nest-swagger-utils";
import { ApiUser } from "src/controllers/swagger/user.swagger";

@ApiTags("users")
@Controller("users")
export class UserController {
  private users = [];

  @ApiUser.CreateUser({ summary: "새 사용자 생성" })
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    const newUser = {
      id: this.users.length + 1,
      ...createUserDto,
      password: "******",
    };
    this.users.push(newUser);
    return newUser;
  }

  @ApiUser.GetUsers({ summary: "모든 사용자 조회" })
  @Get()
  getUsers() {
    return this.users;
  }

  @ApiUser.GetUser({ summary: "사용자 조회" })
  @Get(":id")
  getUser(@Param("id", ParseIntPipe) id: number) {
    return this.users.find((user) => user.id === id);
  }
}
