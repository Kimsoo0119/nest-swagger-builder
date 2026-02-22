import { ApiDecoratorBuilder } from "nest-swagger-builder";

export const CustomSwaggerBuilder = new ApiDecoratorBuilder({
  statusKey: "status",
  wrapperKey: "data",
});

export const SuccessSwaggerBuilder = new ApiDecoratorBuilder({
  extraFields: {
    success: { type: "boolean", example: true },
  },
  wrapperKey: "data",
});

export const StandardSwaggerBuilder = new ApiDecoratorBuilder({
  extraFields: {
    success: { type: "boolean", example: true },
    message: { type: "string", example: "OK" },
  },
  wrapperKey: "result",
});
