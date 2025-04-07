# Nest Swagger Builder

[![npm version](https://badge.fury.io/js/nest-swagger-builder.svg)](https://badge.fury.io/js/nest-swagger-builder)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A utility library that simplifies the NestJS Swagger documentation process.

[한국어](README.ko.md)

## Introduction

`nest-swagger-builder` makes creating Swagger documentation in NestJS applications more intuitive and maintainable. It introduces a method chaining builder pattern that results in cleaner, more readable API documentation code.

### Why Use Nest Swagger Builder?

- **Reduce Boilerplate**: Simplify complex Swagger decorator configurations
- **Type Safety**: Leverage TypeScript's type system for better developer experience
- **Consistency**: Maintain uniform API documentation across your entire project
- **Readability**: Write self-documenting API decorator configurations
- **Maintainability**: Organize your Swagger documentation into dedicated files

## Installation

```bash
npm install nest-swagger-builder
```

### Peer Dependencies

This library requires the following peer dependencies:

```bash
npm install @nestjs/common @nestjs/swagger class-transformer class-validator
```

## Supported Versions

- NestJS: ^8.0.0 || ^9.0.0 || ^10.0.0
- Swagger: ^5.0.0 || ^6.0.0 || ^7.0.0 || ^8.0.0
- class-validator: ^0.13.2 || ^0.14.0
- class-transformer: ^0.5.1

## Quick Start

### 1. Create a Swagger Declaration File

```typescript
// src/controllers/swagger/user.swagger.ts
import { HttpStatus } from "@nestjs/common";
import { ApiDecoratorBuilder, ApiOperator } from "nest-swagger-builder";
import { UserController } from "../user.controller";
import { UserDto } from "../../dto/user.dto";

// Type-safe API operator with controller method keys
export const ApiUser: ApiOperator<keyof UserController> = {
  GetUsers: (apiOperationOptions) => {
    return new ApiDecoratorBuilder()
      .withOperation(apiOperationOptions)
      .withBearerAuth()
      .withBodyResponse(HttpStatus.OK, "ApiUser_GetUsers", [UserDto])
      .build();
  },

  // More API definitions...
};
```

### 2. Use in Your Controller

```typescript
// src/controllers/user.controller.ts
import { Controller, Get } from "@nestjs/common";
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

  // More controller methods...
}
```

## Usage Patterns

### Simple Response with Status Code Only

```typescript
new ApiDecoratorBuilder()
  .withOperation({ summary: "Create new user" })
  .withBearerAuth()
  .withStatusResponse(HttpStatus.CREATED, "UserCreated")
  .build();
```

### Response with Data

```typescript
new ApiDecoratorBuilder()
  .withOperation({ summary: "Get user profile" })
  .withBearerAuth()
  .withBodyResponse(HttpStatus.OK, "UserProfile", UserDto)
  .build();
```

### Array Response

```typescript
new ApiDecoratorBuilder()
  .withOperation({ summary: "Get all users" })
  .withBearerAuth()
  .withBodyResponse(HttpStatus.OK, "UsersList", [UserDto])
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

### Interfaces

#### ApiErrorResponse

```typescript
interface ApiErrorResponse {
  name: string;
  error: string;
  description?: string;
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

## Examples

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

## Key Benefits

- **Functional Approach**: Write clear, purpose-driven code through utility functions
- **Type Safety**: Strong type support through TypeScript
- **Consistent Documentation**: Maintain uniform Swagger documentation across your project
- **Flexible Extensibility**: Easily add custom decorators

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This library is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
