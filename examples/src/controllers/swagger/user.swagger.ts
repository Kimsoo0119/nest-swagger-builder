import { HttpStatus } from "@nestjs/common";
import { ApiDecoratorBuilder, ApiOperator } from "nest-swagger-builder";
import { CustomSwaggerBuilder } from "src/config/custom-swagger-builder";
import { UserController } from "src/controllers/user.controller";
import { UserDto } from "src/dto/user.dto";

export const ApiUser: ApiOperator<keyof UserController> = {
  CreateUser: (apiOperationOptions) => {
    return new ApiDecoratorBuilder()
      .withOperation(apiOperationOptions)
      .withBearerAuth()
      .withStatusResponse(HttpStatus.CREATED, "ApiUser_CreateUser")
      .withException(HttpStatus.BAD_REQUEST, [
        { name: "case1", error: "error1", description: "description1" },
        { name: "case2", error: "error2", description: "description2" },
      ])
      .withUnauthorizedResponse([
        { name: "case1", error: "error1", description: "description1" },
        { name: "case2", error: "error2", description: "description2" },
      ])
      .build();
  },

  GetUsers: (apiOperationOptions) => {
    return new ApiDecoratorBuilder()
      .withOperation(apiOperationOptions)
      .withCookieAuth()
      .withBodyResponse(HttpStatus.OK, "ApiUser_GetUsers", [UserDto], {
        statusKey: "status",
        wrapperKey: "data",
      })
      .build();
  },

  GetUser: (apiOperationOptions) => {
    return CustomSwaggerBuilder.withOperation(apiOperationOptions)
      .withBearerAuth()
      .withBodyResponse(HttpStatus.OK, "ApiUser_GetUser", UserDto)
      .build();
  },

  UploadImageFile: (apiOperationOptions) => {
    return new ApiDecoratorBuilder()
      .withOperation(apiOperationOptions)
      .withFormDataRequest("ApiUser_UploadFile", "image")
      .withBodyResponse(HttpStatus.CREATED, "ApiUser_UploadImageFile", String)
      .build();
  },

  UploadImageFiles: (apiOperationOptions) => {
    return new ApiDecoratorBuilder()
      .withOperation(apiOperationOptions)
      .withFormDataRequest("ApiUser_UploadFiles", "images", {
        isArray: true,
      })
      .withBodyResponse(HttpStatus.CREATED, "ApiUser_UploadImageFiles", [String])
      .build();
  },
};
