import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/users.schema';
import { Player, PlayerDocument } from '../schemas/players.schema';

@Injectable()
export class PlayersService {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>,
              @InjectModel(Player.name) private PlayerModel: Model<PlayerDocument>) {}

  async create(createPlayer: Player): Promise<Player> {
    const createdPlayer = new this.PlayerModel(createPlayer);
    return await createdPlayer.save();
  }

  async findAll(): Promise<User[]> {
    return this.UserModel.find().exec();
  }
}
