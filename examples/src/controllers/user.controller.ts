import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from "@nestjs/common";
import { CreateUserDto } from "../dto/request/create-user.dto.js";
import { ApiTags } from "@nestjs/swagger";
import { ApiUser } from "src/controllers/swagger/user.swagger";

@ApiTags("users")
@Controller("users")
export class UserController {
  private users = [];

  @ApiUser.CreateUser({ summary: "Create New User" })
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

  @ApiUser.GetUsers({ summary: "Get All Users" })
  @Get()
  getUsers() {
    return this.users;
  }

  @ApiUser.GetUser({ summary: "Get User" })
  @Get(":id")
  getUser(@Param("id", ParseIntPipe) id: number) {
    return this.users.find((user) => user.id === id);
  }
}
