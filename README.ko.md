# Nest Swagger Builder

[![npm version](https://badge.fury.io/js/nest-swagger-builder.svg)](https://badge.fury.io/js/nest-swagger-builder)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

NestJS에서 Swagger 문서 작성을 함수형 스타일로, 타입 안전하고 직관적으로 구성할 수 있는 유틸리티 라이브러리입니다.

[English](README.md)

## ✨ 주요 특징

- **보일러플레이트 감소**: 복잡한 Swagger 데코레이터를 간결하게 선언
- **타입 안전성**: Nest 컨트롤러 메서드를 기준으로 API 키 생성
- **가독성 및 일관성**: 선언적이고 명확한 Swagger 구성
- **유지보수성 향상**: Swagger 구성을 별도 파일로 분리 가능
- **유연한 커스터마이징**: 응답 구조(statusKey, wrapperKey)를 상황에 맞게 조정 가능

## 📦 설치

```bash
npm install nest-swagger-builder
```

### 필수 Peer Dependencies:

```bash
npm install @nestjs/common @nestjs/swagger class-transformer class-validator
```

## ✅ 지원 범위

- **NestJS**: ^8.0.0, ^9.0.0, ^10.0.0
- **Swagger**: ^5.0.0 ~ ^8.0.0
- **class-validator**: ^0.13.2 ~ ^0.14.0
- **class-transformer**: ^0.5.1

## 🚀 빠르게 시작하기

### 1. Swagger 선언 파일 작성

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

### 2. 컨트롤러에서 사용

```typescript
@ApiTags("users")
@Controller("users")
export class UserController {
  @ApiUser.GetUsers({ summary: "모든 사용자 조회" })
  @Get()
  getUsers() {
    return this.users;
  }
}
```

## 🧩 응답 구조 커스터마이징 (New)

현업에서는 팀/서비스마다 Interceptor에서 반환하는 JSON 구조가 다릅니다.

예:

```typescript
// A 서비스
{ "statusCode": 200, "data": { ... } }

// B 서비스
{ "status": 200, "result": { ... } }
```

`nest-swagger-builder`는 기본적으로 순수 Swagger 구조(`{}`)를 반환합니다.
하지만 다음 두 가지 방식으로 커스터마이징된 응답 구조를 Swagger에 손쉽게 반영할 수 있습니다:

### ✅ 개별 응답에서 직접 설정

```typescript
new ApiDecoratorBuilder()
  .withOperation(apiOperationOptions)
  .withBodyResponse(HttpStatus.OK, "UserDetail", UserDto, {
    statusKey: "status",
    wrapperKey: "data",
  })
  .build();
```

### ✅ 공통 설정 빌더 사용

```typescript
// src/config/custom-swagger-builder.ts
export const CustomSwaggerBuilder = new ApiDecoratorBuilder({
  statusKey: "status",
  wrapperKey: "data",
});
```

사용 예시:

```typescript
CustomSwaggerBuilder.withOperation(apiOperationOptions)
  .withBodyResponse(HttpStatus.OK, "UserDetail", UserDto)
  .build();
```

## 📝 API 응답 패턴

### 상태 코드만 있는 응답

```typescript
new ApiDecoratorBuilder()
  .withOperation(apiOperationOptions)
  .withBearerAuth()
  .withStatusResponse(HttpStatus.CREATED, "UserCreated", { statusKey: "statusCode" })
  .build();
```

### 데이터가 포함된 응답

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

### 배열 응답

```typescript
new ApiDecoratorBuilder()
  .withOperation(apiOperationOptions)
  .withBearerAuth()
  .withBodyResponse(HttpStatus.OK, "UsersList", [UserDto], {
    statusKey: "status",
    wrapperKey: "data",
  })
  .build();
```

### 오류 응답

```typescript
new ApiDecoratorBuilder()
  .withOperation(apiOperationOptions)
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

### 파일 업로드 (Multipart Form Data)

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
  .withFormDataRequest("GalleryImages", "images", { isArray: true })
  .withBodyResponse(HttpStatus.CREATED, "ImagesUploaded", [ImageDto])
  .build();
```

컨트롤러에서 사용 예시:

```typescript
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@ApiUser.UploadImageFile({ summary: "단일 이미지 업로드" })
@UseInterceptors(FileInterceptor('image'))
@Post('upload')
uploadFile(@UploadedFile() file: Express.Multer.File) {
  return { filename: file.originalname, size: file.size };
}
```

## 📚 API 참조

### ApiDecoratorBuilder

메서드 체이닝을 통해 Swagger 데코레이터를 생성하는 클래스입니다.

#### 생성자

```typescript
new ApiDecoratorBuilder(config?: ApiDecoratorBuilderConfig)
```

| 매개변수 | 설명                                 | 타입                        |
| -------- | ------------------------------------ | --------------------------- |
| `config` | 응답 형식 기본 설정 객체 (선택 사항) | `ApiDecoratorBuilderConfig` |

#### ApiDecoratorBuilderConfig

```typescript
interface ApiDecoratorBuilderConfig {
  wrapperKey?: string | undefined; // 응답 데이터를 감싸는 프로퍼티 이름 (예: "data")
  statusKey?: string | undefined; // 상태 코드 프로퍼티 이름 (예: "statusCode")
}
```

#### 주요 메서드

| 메서드                     | 설명                         | 매개변수                                                                       |
| -------------------------- | ---------------------------- | ------------------------------------------------------------------------------ |
| `withOperation`            | API 작업 정보 추가           | `options: ApiOperationOptions`                                                 |
| `withBearerAuth`           | Bearer 인증 추가             | `name?: string`                                                                |
| `withStatusResponse`       | 상태 코드만 있는 응답 추가   | `status: number, key: string, options?: ResponseOptions`                       |
| `withBodyResponse`         | 데이터가 포함된 응답 추가    | `status: number, key: string, type: Type \| Type[], options?: ResponseOptions` |
| `withFormDataRequest`      | 파일 업로드 지원 추가        | `key: string, fileFieldName: string, options?: Record<string, any>`            |
| `withErrorResponses`       | 400 오류 응답 추가           | `errors: ApiErrorResponse[]`                                                   |
| `withUnauthorizedResponse` | 401 오류 응답 추가           | `errors: ApiErrorResponse[]`                                                   |
| `withForbiddenResponse`    | 403 오류 응답 추가           | `errors: ApiErrorResponse[]`                                                   |
| `withNotFoundResponse`     | 404 오류 응답 추가           | `errors: ApiErrorResponse[]`                                                   |
| `withDecorator`            | 사용자 정의 데코레이터 추가  | `decorator: MethodDecorator \| PropertyDecorator`                              |
| `build`                    | 모든 데코레이터 결합 및 반환 | -                                                                              |

### 인터페이스

#### ResponseOptions

```typescript
interface ResponseOptions {
  statusKey?: string; // 응답에 포함될 상태 코드 필드 이름
  wrapperKey?: string; // 응답에 포함될 데이터 필드 이름
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

## 🔍 예제

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

## 📋 라이센스

이 라이브러리는 MIT 라이센스 하에 배포됩니다 - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.
