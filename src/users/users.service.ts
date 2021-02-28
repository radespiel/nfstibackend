import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/users.schema';


@Injectable()
export class UsersService {

  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

  async create(createUser: User): Promise<User> {
    const createdUser = new this.UserModel(createUser);
    return await createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.UserModel.find().exec();
  }

  async searchMySquad(logedEmail){
    const x =  await await this.UserModel.find({ email: logedEmail }).populate('players').exec();
    console.log(x)
    return x
  }

  async isUpdated(user) {
    return await this.UserModel.findOne({_id: user.id, name: user.name, email: user.email, bday: user.bday }).countDocuments();
  }
}
