import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  const config = new DocumentBuilder()
    .setTitle("NestJS API")
    .setDescription("NestJS Swagger Utils Test API")
    .setVersion("1.0")
    .addBearerAuth({
      type: "http",
      scheme: "bearer",
      name: "JWT",
      in: "header",
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("api", app, document);

  await app.listen(3000);
}
bootstrap();
