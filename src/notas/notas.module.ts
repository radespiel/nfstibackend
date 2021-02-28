import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Nota, NotaSchema } from 'src/schemas/notas.schema';
import { NotasController } from './notas.controller';
import { NotasService } from './notas.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Nota.name, schema: NotaSchema }])],
    controllers: [NotasController,],
    providers: [NotasService,]
})
export class NotasModule {}
