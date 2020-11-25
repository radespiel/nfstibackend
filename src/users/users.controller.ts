import { Controller, Get, Post, Body, UseGuards, Param, Header, Inject, Request, Req, Put, UseInterceptors, UploadedFile, Res, Query, BadRequestException, ParseIntPipe, UseFilters } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../schemas/users.schema';
import * as bcrypt from 'bcrypt';
import MongoExceptionFilter from '../filters/mongo.exception.filter'
//import { AuthenticationGuard } from '../guards/authentication.guard';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @UseFilters(MongoExceptionFilter)
  async create(@Body() user: User): Promise<User> {
    
    var senhatexto = user.password;
    user.password = bcrypt.hashSync(user.password, 10);
    var verif = bcrypt.compareSync(senhatexto, user.password);
    if (verif = true) {
      console.log(senhatexto, "=", user.password);
    }
    return await this.usersService.create(user);
  } 

  @Get("mysquad")
  @UseFilters(MongoExceptionFilter)
  async returnMysquad(@Req() request: Request): Promise<User> {
  const logedUserData = request["user"];
  return await this.usersService.searchMySquad(logedUserData.email);
  } 
}
