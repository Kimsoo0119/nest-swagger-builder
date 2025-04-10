import { ApiDecoratorBuilder } from "nest-swagger-builder";

export const CustomSwaggerBuilder = new ApiDecoratorBuilder({
  statusKey: "status",
  wrapperKey: "data",
});
