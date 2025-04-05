import { Module } from "@nestjs/common";
import { AppService } from "./services/app.service";
import { UserController } from "./controllers/user.controller";
import { AppController } from "./controllers/app.controller";

@Module({
  imports: [],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {}
