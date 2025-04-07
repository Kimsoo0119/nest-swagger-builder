# Nest Swagger Builder

[![npm version](https://badge.fury.io/js/nest-swagger-builder.svg)](https://badge.fury.io/js/nest-swagger-builder)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

NestJS Swagger 문서화 과정을 단순화하는 유틸리티 라이브러리입니다.

[English](README.md)

## Introduction

`nest-swagger-builder`는 NestJS 애플리케이션에서 Swagger 문서 작성을 더 직관적이고 유지보수하기 쉽게 만듭니다. 메서드 체이닝 빌더 패턴을 도입하여 더 깔끔하고 가독성 높은 API 문서화 코드를 작성할 수 있습니다.

### Nest Swagger Builder를 사용해야 하는 이유

- **보일러플레이트 감소**: 복잡한 Swagger 데코레이터 설정을 단순화
- **타입 안전성**: TypeScript의 타입 시스템을 활용하여 개발자 경험 향상
- **일관성**: 프로젝트 전체에 걸쳐 균일한 API 문서화 유지
- **가독성**: 자체 문서화가 되는 API 데코레이터 설정 작성
- **유지보수성**: Swagger 문서를 전용 파일로 구성하여 관리

## 설치

```bash
npm install nest-swagger-builder
```

### Peer Dependencies

이 라이브러리는 다음 Peer Dependencies가 필요합니다.

```bash
npm install @nestjs/common @nestjs/swagger class-transformer class-validator
```

## 지원 버전

- NestJS: ^8.0.0 || ^9.0.0 || ^10.0.0
- Swagger: ^5.0.0 || ^6.0.0 || ^7.0.0 || ^8.0.0
- class-validator: ^0.13.2 || ^0.14.0
- class-transformer: ^0.5.1

## 빠른 시작

### 1. Swagger 선언 파일 작성

```typescript
// src/controllers/swagger/user.swagger.ts
import { HttpStatus } from "@nestjs/common";
import { ApiDecoratorBuilder, ApiOperator } from "nest-swagger-builder";
import { UserController } from "../user.controller";
import { UserDto } from "../../dto/user.dto";

// 컨트롤러 메서드를 키로 사용하여 타입 안전성 확보
export const ApiUser: ApiOperator<keyof UserController> = {
  GetUsers: (apiOperationOptions) => {
    return new ApiDecoratorBuilder()
      .withOperation(apiOperationOptions)
      .withBearerAuth()
      .withBodyResponse(HttpStatus.OK, "ApiUser_GetUsers", [UserDto])
      .build();
  },

  // 더 많은 API 정의...
};
```

### 2. 컨트롤러에서 사용

```typescript
// src/controllers/user.controller.ts
import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiUser } from "./swagger/user.swagger";

@ApiTags("users")
@Controller("users")
export class UserController {
  private users = [];

  @ApiUser.GetUsers({ summary: "모든 사용자 조회" })
  @Get()
  getUsers() {
    return this.users;
  }

  // 더 많은 컨트롤러 메서드...
}
```

## 사용 패턴

### 상태 코드만 있는 간단한 응답

```typescript
new ApiDecoratorBuilder()
  .withOperation({ summary: "새 사용자 생성" })
  .withBearerAuth()
  .withStatusResponse(HttpStatus.CREATED, "UserCreated")
  .build();
```

### 데이터가 포함된 응답

```typescript
new ApiDecoratorBuilder()
  .withOperation({ summary: "사용자 프로필 조회" })
  .withBearerAuth()
  .withBodyResponse(HttpStatus.OK, "UserProfile", UserDto)
  .build();
```

### 배열 응답

```typescript
new ApiDecoratorBuilder()
  .withOperation({ summary: "모든 사용자 조회" })
  .withBearerAuth()
  .withBodyResponse(HttpStatus.OK, "UsersList", [UserDto])
  .build();
```

### 오류 응답

```typescript
new ApiDecoratorBuilder()
  .withOperation({ summary: "사용자 삭제" })
  .withBearerAuth()
  .withStatusResponse(HttpStatus.NO_CONTENT, "UserDeleted")
  .withUnauthorizedResponse([
    {
      name: "InvalidToken",
      error: "잘못된 토큰",
      description: "제공된 인증 토큰이 유효하지 않습니다",
    },
  ])
  .withNotFoundResponse([
    {
      name: "UserNotFound",
      error: "사용자를 찾을 수 없음",
      description: "주어진 ID의 사용자를 찾을 수 없습니다",
    },
  ])
  .build();
```

### Multipart Form Data를 이용한 파일 업로드

파일 업로드를 처리하려면 `withFormDataRequest` 메서드를 사용하세요

```typescript
// 단일 파일 업로드
new ApiDecoratorBuilder()
  .withOperation(apiOperationOptions)
  .withFormDataRequest("ProfileImage", "image")
  .withBodyResponse(HttpStatus.CREATED, "ImageUploaded", ImageDto)
  .build();

// 다중 파일 업로드
new ApiDecoratorBuilder()
  .withOperation(apiOperationOptions)
  .withFormDataRequest("GalleryImages", "images", {
    isArray: true,
  })
  .withBodyResponse(HttpStatus.CREATED, "ImagesUploaded", [ImageDto])
  .build();
```

그리고 컨트롤러에서 NestJS의 `FileInterceptor` 또는 `FilesInterceptor`와 함께 사용하세요:

```typescript
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@ApiUser.UploadImageFile({ summary: "단일 이미지 업로드" })
@UseInterceptors(FileInterceptor('image'))
@Post('upload')
uploadFile(@UploadedFile() file: Express.Multer.File) {
  return {
    filename: file.originalname,
    size: file.size
  };
}

@ApiUser.UploadImageFiles({ summary: "다중 이미지 업로드" })
@UseInterceptors(FilesInterceptor('images'))
@Post('upload-multiple')
uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
  return files.map(file => ({
    filename: file.originalname,
    size: file.size
  }));
}
```

## API 참조

### ApiDecoratorBuilder

메서드 체이닝을 통해 Swagger 데코레이터를 생성하는 클래스입니다.

#### 메서드

| 메서드                     | 설명                         | 매개변수                                                                           |
| -------------------------- | ---------------------------- | ---------------------------------------------------------------------------------- |
| `withOperation`            | API 작업 정보 추가           | `options: ApiOperationOptions`                                                     |
| `withCookieAuth`           | 쿠키 인증 추가               | `name?: string`                                                                    |
| `withBearerAuth`           | Bearer 인증 추가             | `name?: string`                                                                    |
| `withStatusResponse`       | 상태 코드만 있는 응답 추가   | `status: number, key: string`                                                      |
| `withBodyResponse`         | 데이터가 포함된 응답 추가    | `status: number, key: string, type: Type \| Type[], options?: Record<string, any>` |
| `withFormDataRequest`      | 파일 업로드 지원 추가        | `key: string, fileFieldName: string, options?: Record<string, any>`                |
| `withException`            | 예외 응답 추가               | `status: number, errors: ApiErrorResponse[]`                                       |
| `withErrorResponses`       | 400 오류 응답 추가           | `errors: ApiErrorResponse[]`                                                       |
| `withUnauthorizedResponse` | 401 오류 응답 추가           | `errors: ApiErrorResponse[]`                                                       |
| `withForbiddenResponse`    | 403 오류 응답 추가           | `errors: ApiErrorResponse[]`                                                       |
| `withNotFoundResponse`     | 404 오류 응답 추가           | `errors: ApiErrorResponse[]`                                                       |
| `withDecorator`            | 사용자 정의 데코레이터 추가  | `decorator: MethodDecorator \| PropertyDecorator`                                  |
| `build`                    | 모든 데코레이터 결합 및 반환 | -                                                                                  |

### 인터페이스

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

## 예제

이 저장소에는 라이브러리 사용 방법을 보여주는 예제 NestJS 애플리케이션이 포함되어 있습니다:

```bash
# 저장소 복제
git clone https://github.com/Kimsoo0119/nest-swagger-builder.git

# 메인 프로젝트에 의존성 설치
cd nest-swagger-builder
npm install
npm run build

# 예제 애플리케이션 실행
cd examples
npm install
npm run start:dev

# Swagger UI 접근
브라우저에서 http://localhost:3000/api 열기
```

## 주요 이점

- **함수형 접근 방식**: 유틸리티 함수를 통해 명확하고 목적이 분명한 코드 작성
- **타입 안전성**: TypeScript의 강력한 타입 지원
- **일관된 문서화**: 프로젝트 전체에 걸쳐 균일한 Swagger 문서 유지
- **유연한 확장성**: 사용자 정의 데코레이터를 쉽게 추가 가능

## 기여

기여는 언제나 환영합니다! 풀 리퀘스트를 자유롭게 제출해 주세요.

## 라이센스

이 라이브러리는 MIT 라이센스 하에 배포됩니다 - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.
