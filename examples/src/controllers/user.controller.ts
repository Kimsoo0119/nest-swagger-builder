import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { CreateUserDto } from "../dto/request/create-user.dto.js";
import { ApiTags } from "@nestjs/swagger";
import { ApiUser } from "src/controllers/swagger/user.swagger";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";

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

  @ApiUser.UploadImageFile({ summary: "Upload File" })
  @UseInterceptors(FileInterceptor("image"))
  @Post("upload")
  UploadImageFile(@UploadedFile() image: Express.Multer.File) {
    return `https://www.test.com/${image.fieldname}`;
  }

  @ApiUser.UploadImageFiles({ summary: "Upload Files" })
  @UseInterceptors(FilesInterceptor("images"))
  @Post("upload-files")
  UploadImageFiles(@UploadedFiles() images: Express.Multer.File[]) {
    return images.map((image) => `https://www.test.com/${image.fieldname}`);
  }
}
