import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { mongoose } from '@typegoose/typegoose';
import { Document, Types } from 'mongoose';
import {Player} from './players.schema'

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({required: true})
  name: string;

  @Prop({required: true, unique: true})
  email: string;

  @Prop({required: true})
  password: string;
  
  @Prop({required: true})
  bday: Date;

  @Prop({default: 100})
  money: number

  @Prop([{ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'Player', validate: [arrayLimit, '{PATH} exceeds the limit of 5'] }])
  players: Player[];
}

function arrayLimit(val) {
  return val.length <= 5;
}

export const UserSchema = SchemaFactory.createForClass(User);