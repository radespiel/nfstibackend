import { Controller, Get, Post, Body, UseGuards, Param, Header, Inject, Request, Req, Put, UseInterceptors, UploadedFile, Res, Query, BadRequestException, ParseIntPipe, UseFilters } from '@nestjs/common';
import { NotasService } from './notas.service';
import { Nota } from '../schemas/notas.schema';
import MongoExceptionFilter from '../filters/mongo.exception.filter'


@Controller('notas')
export class NotasController {
  constructor(private readonly notasService: NotasService) { }

  @Post()
  @UseFilters(MongoExceptionFilter)
  async create(@Body() nota: Nota): Promise<Nota> {
    return await this.notasService.create(nota);
  }

  @Get("/:numero")
  async getNotas(@Req() request: Request,
  @Param("numero") numero: string) {
    console.log("nota: ", numero)
    return await this.notasService.getNotas(numero)
  }

  @Get('anexos/:filename')
  async serveAvatar(@Param('filename') filename: string, @Res() res): Promise<any> {
    res.sendFile(filename, { root: 'anexos'});
  }
}
