import { UsersModule } from './users/users.module';
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose'
import { LoginModule } from './login/login.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/cs-project-db'),
    UsersModule,
    LoginModule,
  ],
  controllers: [
  ],
  providers: [
  ],
})
export class AppModule {

}
