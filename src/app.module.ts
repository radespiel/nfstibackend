import { UsersModule } from './users/users.module';
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose'
import { GetUserMiddleware } from './middlewares/get-users.middleware';
import { UsersService } from './users/users.service';
import { Nota, NotaSchema } from './schemas/notas.schema';
import { NotasModule } from './notas/notas.module';
import { User, UserSchema } from './schemas/users.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nfsti'),
    UsersModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Nota.name, schema: NotaSchema }]),
    NotasModule
  ],
  controllers: [
  ],
  providers: [
    UsersService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(GetUserMiddleware)
      .forRoutes("users", "players");

  }
}
