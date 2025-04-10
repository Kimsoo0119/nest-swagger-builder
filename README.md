# Nest Swagger Builder

[![npm version](https://badge.fury.io/js/nest-swagger-builder.svg)](https://badge.fury.io/js/nest-swagger-builder)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A utility library that makes Swagger documentation in NestJS functional, type-safe, and intuitive.

[한국어](README.ko.md)

## ✨ Key Features

- **Reduce Boilerplate**: Simplify complex Swagger decorator configurations
- **Type Safety**: Generate API keys based on Nest controller methods
- **Readability & Consistency**: Clear, declarative Swagger configurations
- **Improved Maintainability**: Separate Swagger configs into dedicated files
- **Flexible Customization**: Adjust response structure (statusKey, wrapperKey) as needed

## 📦 Installation

```bash
npm install nest-swagger-builder
```

### Required Peer Dependencies:

```bash
npm install @nestjs/common @nestjs/swagger class-transformer class-validator
```

## ✅ Supported Versions

- **NestJS**: ^8.0.0, ^9.0.0, ^10.0.0
- **Swagger**: ^5.0.0 ~ ^8.0.0
- **class-validator**: ^0.13.2 ~ ^0.14.0
- **class-transformer**: ^0.5.1

## 🚀 Quick Start

### 1. Create a Swagger Declaration File

```typescript
// src/controllers/swagger/user.swagger.ts
import { HttpStatus } from "@nestjs/common";
import { ApiDecoratorBuilder, ApiOperator } from "nest-swagger-builder";
import { UserController } from "../user.controller";
import { UserDto } from "../../dto/user.dto";

export const ApiUser: ApiOperator<keyof UserController> = {
  GetUsers: (apiOperationOptions) =>
    new ApiDecoratorBuilder()
      .withOperation(apiOperationOptions)
      .withBearerAuth()
      .withBodyResponse(HttpStatus.OK, "ApiUser_GetUsers", [UserDto])
      .build(),
};
```

### 2. Use in Your Controller

```typescript
@ApiTags("users")
@Controller("users")
export class UserController {
  @ApiUser.GetUsers({ summary: "Get all users" })
  @Get()
  getUsers() {
    return this.users;
  }
}
```

## 🧩 Customizing Response Structure (New)

In professional environments, each team/service may return different JSON structures from their interceptors.

Examples:

```typescript
// Service A
{ "statusCode": 200, "data": { ... } }

// Service B
{ "status": 200, "result": { ... } }
```

By default, `nest-swagger-builder` returns pure Swagger structure (`{}`).
However, you can easily reflect customized response structures in Swagger in two ways:

### ✅ Direct Configuration in Individual Responses

```typescript
new ApiDecoratorBuilder()
  .withOperation(apiOperationOptions)
  .withBodyResponse(HttpStatus.OK, "UserDetail", UserDto, {
    statusKey: "status",
    wrapperKey: "data",
  })
  .build();
```

### ✅ Using a Common Configuration Builder

```typescript
// src/config/custom-swagger-builder.ts
export const CustomSwaggerBuilder = new ApiDecoratorBuilder({
  statusKey: "status",
  wrapperKey: "data",
});
```

Usage example:

```typescript
CustomSwaggerBuilder.withOperation(apiOperationOptions)
  .withBodyResponse(HttpStatus.OK, "UserDetail", UserDto)
  .build();
```

## 📝 API Response Patterns

### Response with Status Code Only

```typescript
new ApiDecoratorBuilder()
  .withOperation(apiOperationOptions)
  .withBearerAuth()
  .withStatusResponse(HttpStatus.CREATED, "UserCreated", {
    statusKey: "statusCode",
  })
  .build();
```

### Response with Data

```typescript
new ApiDecoratorBuilder()
  .withOperation(apiOperationOptions)
  .withBearerAuth()
  .withBodyResponse(HttpStatus.OK, "UserProfile", UserDto, {
    statusKey: "status",
    wrapperKey: "data",
  })
  .build();
```

### Array Response

```typescript
new ApiDecoratorBuilder()
  .withOperation({ summary: "Get all users" })
  .withBearerAuth()
  .withBodyResponse(HttpStatus.OK, "UsersList", [UserDto], {
    statusKey: "status",
    wrapperKey: "data",
  })
  .build();
```

### Error Responses

```typescript
new ApiDecoratorBuilder()
  .withOperation({ summary: "Delete user" })
  .withBearerAuth()
  .withStatusResponse(HttpStatus.NO_CONTENT, "UserDeleted")
  .withUnauthorizedResponse([
    {
      name: "InvalidToken",
      error: "Invalid Token",
      description: "The provided authentication token is invalid",
    },
  ])
  .withNotFoundResponse([
    {
      name: "UserNotFound",
      error: "User Not Found",
      description: "The user with the given ID was not found",
    },
  ])
  .build();
```

### File Upload (Multipart Form Data)

```typescript
// Single File Upload
new ApiDecoratorBuilder()
  .withOperation(apiOperationOptions)
  .withFormDataRequest("ProfileImage", "image")
  .withBodyResponse(HttpStatus.CREATED, "ImageUploaded", ImageDto)
  .build();

// Multiple Files Upload
new ApiDecoratorBuilder()
  .withOperation(apiOperationOptions)
  .withFormDataRequest("GalleryImages", "images", { isArray: true })
  .withBodyResponse(HttpStatus.CREATED, "ImagesUploaded", [ImageDto])
  .build();
```

Usage example in controller:

```typescript
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@ApiUser.UploadImageFile({ summary: "Upload single image" })
@UseInterceptors(FileInterceptor('image'))
@Post('upload')
uploadFile(@UploadedFile() file: Express.Multer.File) {
  return { filename: file.originalname, size: file.size };
}
```

## 📚 API Reference

### ApiDecoratorBuilder

A class that creates Swagger decorators through method chaining.

#### Constructor

```typescript
new ApiDecoratorBuilder(config?: ApiDecoratorBuilderConfig)
```

| Parameter | Description                                      | Type                        |
| --------- | ------------------------------------------------ | --------------------------- |
| `config`  | Default response format configuration (optional) | `ApiDecoratorBuilderConfig` |

#### ApiDecoratorBuilderConfig

```typescript
interface ApiDecoratorBuilderConfig {
  wrapperKey?: string | undefined; // Property name that wraps response data (e.g., "data")
  statusKey?: string | undefined; // Status code property name (e.g., "statusCode")
}
```

#### Key Methods

| Method                     | Description                        | Parameters                                                                     |
| -------------------------- | ---------------------------------- | ------------------------------------------------------------------------------ |
| `withOperation`            | Add API operation information      | `options: ApiOperationOptions`                                                 |
| `withBearerAuth`           | Add Bearer authentication          | `name?: string`                                                                |
| `withStatusResponse`       | Add response with status code only | `status: number, key: string, options?: ResponseOptions`                       |
| `withBodyResponse`         | Add response with data             | `status: number, key: string, type: Type \| Type[], options?: ResponseOptions` |
| `withFormDataRequest`      | Add file upload support            | `key: string, fileFieldName: string, options?: Record<string, any>`            |
| `withErrorResponses`       | Add 400 error responses            | `errors: ApiErrorResponse[]`                                                   |
| `withUnauthorizedResponse` | Add 401 error responses            | `errors: ApiErrorResponse[]`                                                   |
| `withForbiddenResponse`    | Add 403 error responses            | `errors: ApiErrorResponse[]`                                                   |
| `withNotFoundResponse`     | Add 404 error responses            | `errors: ApiErrorResponse[]`                                                   |
| `withDecorator`            | Add custom decorator               | `decorator: MethodDecorator \| PropertyDecorator`                              |
| `build`                    | Combine all decorators and return  | -                                                                              |

### Interfaces

#### ResponseOptions

```typescript
interface ResponseOptions {
  statusKey?: string; // Status code field name in the response
  wrapperKey?: string; // Data field name in the response
}
```

#### ApiOperator

```typescript
type ApiOperator<M extends string> = {
  [key in Capitalize<M>]: (
    apiOperationOptions: Required<Pick<ApiOperationOptions, "summary">> & ApiOperationOptions
  ) => PropertyDecorator;
};
```

## 🔍 Examples

The repository includes an example NestJS application demonstrating how to use the library:

```bash
# Clone the repository
git clone https://github.com/Kimsoo0119/nest-swagger-builder.git

# Install dependencies in the main project
cd nest-swagger-builder
npm install
npm run build

# Run the example application
cd examples
npm install
npm run start:dev

# Access Swagger UI
Open http://localhost:3000/api in your browser
```

## 📋 License

This library is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
