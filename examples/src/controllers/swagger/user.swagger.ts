import { HttpStatus } from "@nestjs/common";
import { ApiDecoratorBuilder, ApiOperator } from "nest-swagger-builder";
import {
  CustomSwaggerBuilder,
  SuccessSwaggerBuilder,
  StandardSwaggerBuilder,
} from "src/config/custom-swagger-builder";
import { UserController } from "src/controllers/user.controller";
import { UserDto } from "src/dto/user.dto";

export const ApiUser: ApiOperator<keyof UserController> = {
  CreateUser: (apiOperationOptions) => {
    return StandardSwaggerBuilder.withOperation(apiOperationOptions)
      .withBearerAuth()
      .withBodyResponse(HttpStatus.CREATED, "ApiUser_CreateUser", UserDto)
      .withException(HttpStatus.BAD_REQUEST, [
        { error: "error1", description: "description1" },
        { error: "error2", description: "description2" },
      ])
      .withUnauthorizedResponse([
        { error: "error1", description: "description1" },
        { error: "error2", description: "description2" },
      ])
      .build();
  },

  GetUsers: (apiOperationOptions) => {
    return SuccessSwaggerBuilder.withOperation(apiOperationOptions)
      .withCookieAuth()
      .withBodyResponse(HttpStatus.OK, "ApiUser_GetUsers", [UserDto], {
        extraFields: {
          totalCount: { type: "number", example: 50 },
        },
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
