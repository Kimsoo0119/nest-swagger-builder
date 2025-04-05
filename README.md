# nest-swagger-builder

A utility library that simplifies the NestJS Swagger documentation process.

## Introduction

`nest-swagger-builder` is a library that helps you create Swagger documentation in NestJS applications more easily and consistently. It enables writing highly readable API documentation through a method chaining builder pattern.

## Installation

```bash
npm install nest-swagger-builder
```

## Supported Versions

- NestJS: ^8.0.0 || ^9.0.0 || ^10.0.0 || ^11.0.0
- Swagger: ^5.0.0 || ^6.0.0 || ^7.0.0 || ^8.0.0

## Key Features

### API Decorator Builder

You can easily configure Swagger decorators through method chaining.

```typescript
import { ApiDecoratorBuilder } from 'nest-swagger-builder';

export const ApiUser = {
  GetUsers: (options) => {
    return new ApiDecoratorBuilder()
      .withOperation(options)
      .withBearerAuth()
      .withBodyResponse(200, 'ApiUser_GetUsers', [UserDto],)
      .withUnauthorizedResponse([
        { name: "case1", error: "error1", description: "description1" },
        { name: "case2", error: "error2", description: "description2" },
      ])
      .build();
  }
};

// Usage in controller
@ApiUser.GetUsers({ summary: 'Get all users' })
@Get()
getUsers() {
  return this.users;
}
```

## Usage Examples

### 1. Configuring Swagger API Decorators

```typescript
// src/controllers/swagger/user.swagger.ts
import { HttpStatus } from "@nestjs/common";
import { ApiDecoratorBuilder } from "nest-swagger-builder";
import { UserController } from "../user.controller";
import { UserDto } from "../../dto/user.dto";

export const ApiUser: Record<keyof UserController> = {
  GetUsers: (apiOperationOptions) => {
    return new ApiDecoratorBuilder()
      .withOperation(apiOperationOptions)
      .withBearerAuth()
      .withBodyResponse(HttpStatus.OK, "ApiUser_GetUsers", [UserDto])
      .build();
  },

  CreateUser: (apiOperationOptions) => {
    return new ApiDecoratorBuilder()
      .withOperation(apiOperationOptions)
      .withBearerAuth()
      .withStatusResponse(HttpStatus.CREATED, "ApiUser_CreateUser")
      .withErrorResponses([
        {
          name: "ValidationError",
          error: "Validation Failed",
          description: "The input data is not valid.",
        },
      ])
      .build();
  },

  GetUser: (apiOperationOptions) => {
    return new ApiDecoratorBuilder()
      .withOperation(apiOperationOptions)
      .withBearerAuth()
      .withBodyResponse(HttpStatus.OK, "ApiUser_GetUser", UserDto)
      .withNotFoundResponse([
        {
          name: "UserNotFound",
          error: "User Not Found",
          description: "The user with the given ID cannot be found.",
        },
      ])
      .build();
  },
};
```

### 2. Using in Controllers

```typescript
// src/controllers/user.controller.ts
import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateUserDto } from "../dto/request/create-user.dto";
import { ApiTags } from "@nestjs/swagger";
import { ApiUser } from "./swagger/user.swagger";

@ApiTags("users")
@Controller("users")
export class UserController {
  private users = [];

  @ApiUser.GetUsers({ summary: "Get all users" })
  @Get()
  getUsers() {
    return this.users;
  }

  @ApiUser.CreateUser({ summary: "Create new user" })
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

  @ApiUser.GetUser({ summary: "Get user by ID" })
  @Get(":id")
  getUser(@Param("id") id: string) {
    return this.users.find((user) => user.id === parseInt(id));
  }
}
```

## API Reference

### ApiDecoratorBuilder

A class that creates Swagger decorators through method chaining.

#### Methods

| Method                     | Description                        | Parameters                                                                         |
| -------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------- |
| `withOperation`            | Add API operation information      | `options: ApiOperationOptions`                                                     |
| `withCookieAuth`           | Add Cookie authentication          | `name?: string`                                                                    |
| `withBearerAuth`           | Add Bearer authentication          | `name?: string`                                                                    |
| `withStatusResponse`       | Add response with status code only | `status: number, key: string`                                                      |
| `withBodyResponse`         | Add response with data             | `status: number, key: string, type: Type \| Type[], options?: Record<string, any>` |
| `withException`            | Add exception response             | `status: number, errors: ApiErrorResponse[]`                                       |
| `withErrorResponses`       | Add 400 error responses            | `errors: ApiErrorResponse[]`                                                       |
| `withUnauthorizedResponse` | Add 401 error responses            | `errors: ApiErrorResponse[]`                                                       |
| `withForbiddenResponse`    | Add 403 error responses            | `errors: ApiErrorResponse[]`                                                       |
| `withNotFoundResponse`     | Add 404 error responses            | `errors: ApiErrorResponse[]`                                                       |
| `withDecorator`            | Add custom decorator               | `decorator: MethodDecorator \| PropertyDecorator`                                  |
| `build`                    | Combine all decorators and return  | -                                                                                  |

### Utility Functions

| Function                  | Description                           | Parameters                                                                         |
| ------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------- |
| `createStatusResponse`    | Create response with status code only | `status: number, key: string`                                                      |
| `createDetailResponse`    | Create response with data             | `status: number, key: string, type: Type \| Type[], options?: Record<string, any>` |
| `createExceptionResponse` | Create exception response             | `status: number, errors: ApiErrorResponse[]`                                       |

## Features

- **Functional Approach**: Writing clear, purpose-driven code through utility functions
- **Type Safety**: Strong type support through TypeScript
- **Consistent Documentation**: Consistent Swagger documentation across the project
- **Flexible Extensibility**: Ability to add custom decorators

## License

MIT
