import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PlayerDocument = Player & Document;

@Schema()
export class Player {
  @Prop({unique: true})
  name: string;

  @Prop({})
  org: string;

  @Prop({})
  value: number;

  @Prop({})
  lastpontuation: number;

}



export const PlayerSchema = SchemaFactory.createForClass(Player);