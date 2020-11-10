import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {Player} from './players.schema'

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({required: true})
  name: string;

  @Prop({required: true})
  email: string;

  @Prop({required: true})
  password: string;
  
  @Prop({required: true})
  bday: string;

  @Prop({ type: [Types.ObjectId], ref: Player.name })
  players: Player[];
}



export const UserSchema = SchemaFactory.createForClass(User);