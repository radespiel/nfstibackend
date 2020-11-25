import { Controller, Get, Post, Body, UseGuards, Param, Header, Inject, Request, Req, Put, UseInterceptors, UploadedFile, Res, Query, BadRequestException, ParseIntPipe, UseFilters } from '@nestjs/common';
import { User } from '../schemas/users.schema';
import { Player } from '../schemas/players.schema';
import * as bcrypt from 'bcrypt';
import MongoExceptionFilter from '../filters/mongo.exception.filter'
import { PlayersService } from './players.service';
import { TestingModule } from '@nestjs/testing';
//import { AuthenticationGuard } from '../guards/authentication.guard';


@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) { }

  @Post()
  async create(@Body() player: Player): Promise<Player> {
  return await this.playersService.create(player);
  } 

  @Get()
  async teste(@Req() request: Request) {
  const logedUserData = request["user"];
  return logedUserData
  } 
}
