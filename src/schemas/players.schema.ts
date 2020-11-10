import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PlayerDocument = Player & Document;

@Schema()
export class Player {
  @Prop()
  name: string;

}



export const PlayerSchema = SchemaFactory.createForClass(Player);