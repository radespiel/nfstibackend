import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';;
import { Document, Types } from 'mongoose';
export type NotaDocument = Nota & Document;

@Schema()
export class Nota {
  @Prop({required: true})
  quem: string;

  @Prop({required: true})
  fornecedor: string;

  @Prop({required: true})
  cnpj: string;

  @Prop({required: true})
  carimbo: string;

  @Prop({})
  anexo: string;
  
  @Prop({})
  triare: string;

  @Prop({required: true})
  numero: number;

  @Prop({required: true})
  serie: number;

  @Prop({required: true})
  temoc: boolean;

  @Prop({required: true})
  temcer: boolean;

  @Prop({required: true})
  obs: string;
  
  @Prop({required: true})
  vencimento: Date;
}

export const NotaSchema = SchemaFactory.createForClass(Nota);