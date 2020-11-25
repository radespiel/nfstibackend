import { UsersModule } from './users/users.module';
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose'
import { LoginModule } from './login/login.module';
import { PlayersModule } from './players/players.module';
import { GetUserMiddleware } from './middlewares/get-users.middleware';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/cs-project-db'),
    UsersModule,
    LoginModule,
    PlayersModule,
  ],
  controllers: [
  ],
  providers: [
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(GetUserMiddleware)
      .forRoutes("login", "users", "players");

  }
}
