import { ApiProperty } from "@nestjs/swagger";
import { ApiDecoratorBuilder } from "../api-decorator.builder";

const SWAGGER_API_OPERATION = "swagger/apiOperation";
const SWAGGER_API_SECURITY = "swagger/apiSecurity";
const SWAGGER_API_RESPONSE = "swagger/apiResponse";
const SWAGGER_API_MODEL_PROPERTIES = "swagger/apiModelProperties";
const SWAGGER_API_MODEL_PROPERTIES_ARRAY = "swagger/apiModelPropertiesArray";

function applyDecoratorToMethod(
  decorator: MethodDecorator | PropertyDecorator
) {
  class Target {
    method() {}
  }
  const descriptor = Object.getOwnPropertyDescriptor(
    Target.prototype,
    "method"
  )!;
  (decorator as MethodDecorator)(Target.prototype, "method", descriptor);
  Object.defineProperty(Target.prototype, "method", descriptor);
  return Target;
}

function getMethodMeta(target: any, key: string) {
  const descriptor = Object.getOwnPropertyDescriptor(target.prototype, "method");
  return Reflect.getMetadata(key, descriptor!.value);
}

function getResponseType(target: any, status: number): any {
  const responses = getMethodMeta(target, SWAGGER_API_RESPONSE);
  if (!responses) return undefined;
  const entry = responses[status.toString()];
  return entry?.type;
}

function getPropertyMeta(prototype: any, propertyKey: string): any {
  return Reflect.getMetadata(SWAGGER_API_MODEL_PROPERTIES, prototype, propertyKey);
}

function getPropertyKeys(prototype: any): string[] {
  const arr: string[] = Reflect.getMetadata(SWAGGER_API_MODEL_PROPERTIES_ARRAY, prototype) || [];
  return arr.map((k: string) => k.replace(/^:/, ""));
}

class TestDto {
  @ApiProperty({ example: "test" })
  name!: string;
}

describe("ApiDecoratorBuilder - build() state reset", () => {
  it("should reset decorators after build() so second build() has no previous decorators", () => {
    const builder = new ApiDecoratorBuilder();

    const first = builder.withOperation({ summary: "First" }).build();
    const FirstTarget = applyDecoratorToMethod(first);
    const firstMeta = getMethodMeta(FirstTarget, SWAGGER_API_OPERATION);

    expect(firstMeta).toBeDefined();
    expect(firstMeta.summary).toBe("First");

    const second = builder.withOperation({ summary: "Second" }).build();
    const SecondTarget = applyDecoratorToMethod(second);
    const secondMeta = getMethodMeta(SecondTarget, SWAGGER_API_OPERATION);

    expect(secondMeta).toBeDefined();
    expect(secondMeta.summary).toBe("Second");
  });

  it("should not accumulate security entries when reusing singleton", () => {
    const singleton = new ApiDecoratorBuilder();

    for (let i = 0; i < 5; i++) {
      const decorator = singleton.withBearerAuth().build();
      const Target = applyDecoratorToMethod(decorator);
      const security: any[] = getMethodMeta(Target, SWAGGER_API_SECURITY);

      expect(security).toBeDefined();
      expect(security).toHaveLength(1);
    }
  });

  it("should start a clean chain after build()", () => {
    const builder = new ApiDecoratorBuilder();

    builder.withOperation({ summary: "With Auth" }).withBearerAuth().build();

    const decorator = builder.withOperation({ summary: "No Auth" }).build();
    const Target = applyDecoratorToMethod(decorator);

    const operation = getMethodMeta(Target, SWAGGER_API_OPERATION);
    const security = getMethodMeta(Target, SWAGGER_API_SECURITY);

    expect(operation).toBeDefined();
    expect(operation.summary).toBe("No Auth");
    expect(security).toBeUndefined();
  });
});

describe("ApiDecoratorBuilder - extraFields", () => {
  it("should apply config extraFields to withBodyResponse schema", () => {
    const builder = new ApiDecoratorBuilder({
      extraFields: {
        success: { type: "boolean", example: true },
      },
    });

    const decorator = builder
      .withBodyResponse(200, "TestConfig", TestDto)
      .build();
    const Target = applyDecoratorToMethod(decorator);
    const ResponseType = getResponseType(Target, 200);

    expect(ResponseType).toBeDefined();
    const keys = getPropertyKeys(ResponseType.prototype);
    expect(keys).toContain("success");

    const meta = getPropertyMeta(ResponseType.prototype, "success");
    expect(meta.type).toBe(Boolean);
    expect(meta.example).toBe(true);
  });

  it("should apply per-endpoint extraFields to withBodyResponse schema", () => {
    const builder = new ApiDecoratorBuilder();

    const decorator = builder
      .withBodyResponse(200, "TestEndpoint", TestDto, {
        extraFields: {
          totalCount: { type: "number", example: 50 },
        },
      })
      .build();
    const Target = applyDecoratorToMethod(decorator);
    const ResponseType = getResponseType(Target, 200);

    expect(ResponseType).toBeDefined();
    const keys = getPropertyKeys(ResponseType.prototype);
    expect(keys).toContain("totalCount");

    const meta = getPropertyMeta(ResponseType.prototype, "totalCount");
    expect(meta.type).toBe(Number);
    expect(meta.example).toBe(50);
  });

  it("should merge config and endpoint extraFields with endpoint taking priority", () => {
    const builder = new ApiDecoratorBuilder({
      extraFields: {
        success: { type: "boolean", example: true },
        message: { type: "string", example: "default" },
      },
    });

    const decorator = builder
      .withBodyResponse(200, "TestMerge", TestDto, {
        extraFields: {
          message: { type: "string", example: "overridden" },
          totalCount: { type: "number", example: 10 },
        },
      })
      .build();
    const Target = applyDecoratorToMethod(decorator);
    const ResponseType = getResponseType(Target, 200);

    expect(ResponseType).toBeDefined();
    const keys = getPropertyKeys(ResponseType.prototype);
    expect(keys).toContain("success");
    expect(keys).toContain("message");
    expect(keys).toContain("totalCount");

    const messageMeta = getPropertyMeta(ResponseType.prototype, "message");
    expect(messageMeta.example).toBe("overridden");
  });

  it("should create wrapper class with extraFields only (no statusKey/wrapperKey)", () => {
    const builder = new ApiDecoratorBuilder({
      extraFields: {
        success: { type: "boolean", example: true },
      },
    });

    const decorator = builder
      .withBodyResponse(200, "TestOnlyExtra", TestDto)
      .build();
    const Target = applyDecoratorToMethod(decorator);
    const ResponseType = getResponseType(Target, 200);

    expect(ResponseType).toBeDefined();
    expect(ResponseType.name).toBe("TestOnlyExtraResponseDto");

    const keys = getPropertyKeys(ResponseType.prototype);
    expect(keys).toContain("success");
    expect(keys).toContain("data");
  });

  it("should apply config extraFields to withStatusResponse schema", () => {
    const builder = new ApiDecoratorBuilder({
      extraFields: {
        success: { type: "boolean", example: true },
      },
    });

    const decorator = builder
      .withStatusResponse(200, "TestStatusExtra")
      .build();
    const Target = applyDecoratorToMethod(decorator);
    const ResponseType = getResponseType(Target, 200);

    expect(ResponseType).toBeDefined();
    const keys = getPropertyKeys(ResponseType.prototype);
    expect(keys).toContain("success");

    const meta = getPropertyMeta(ResponseType.prototype, "success");
    expect(meta.type).toBe(Boolean);
    expect(meta.example).toBe(true);
  });

  it("should support extraFields combined with wrapperKey", () => {
    const builder = new ApiDecoratorBuilder({
      extraFields: {
        success: { type: "boolean", example: true },
      },
      wrapperKey: "result",
    });

    const decorator = builder
      .withBodyResponse(200, "TestCombined", TestDto)
      .build();
    const Target = applyDecoratorToMethod(decorator);
    const ResponseType = getResponseType(Target, 200);

    expect(ResponseType).toBeDefined();
    const keys = getPropertyKeys(ResponseType.prototype);
    expect(keys).toContain("success");
    expect(keys).toContain("result");
  });

  it("should behave as before when no extraFields provided", () => {
    const builder = new ApiDecoratorBuilder();

    const decorator = builder
      .withBodyResponse(200, "TestNoExtra", TestDto)
      .build();
    const Target = applyDecoratorToMethod(decorator);
    const ResponseType = getResponseType(Target, 200);

    expect(ResponseType).toBe(TestDto);
  });

  it("should support Type (class) in extraFields", () => {
    const builder = new ApiDecoratorBuilder();

    const decorator = builder
      .withBodyResponse(200, "TestObjectField", TestDto, {
        extraFields: {
          metadata: { type: TestDto },
        },
      })
      .build();
    const Target = applyDecoratorToMethod(decorator);
    const ResponseType = getResponseType(Target, 200);

    expect(ResponseType).toBeDefined();
    const keys = getPropertyKeys(ResponseType.prototype);
    expect(keys).toContain("metadata");

    const meta = getPropertyMeta(ResponseType.prototype, "metadata");
    expect(meta.type).toBe(TestDto);
  });

  it("should support array type [Type] in extraFields", () => {
    const builder = new ApiDecoratorBuilder();

    const decorator = builder
      .withBodyResponse(200, "TestArrayField", TestDto, {
        extraFields: {
          items: { type: [TestDto] },
        },
      })
      .build();
    const Target = applyDecoratorToMethod(decorator);
    const ResponseType = getResponseType(Target, 200);

    expect(ResponseType).toBeDefined();
    const keys = getPropertyKeys(ResponseType.prototype);
    expect(keys).toContain("items");

    const meta = getPropertyMeta(ResponseType.prototype, "items");
    expect(meta.type).toBe(TestDto);
    expect(meta.isArray).toBe(true);
  });
});
