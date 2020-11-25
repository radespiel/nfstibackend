import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/users.schema';
import { Player, PlayerSchema } from '../schemas/players.schema';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';


@Module({
    imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Player.name, schema: PlayerSchema }])
    ],
    controllers: [PlayersController],
    providers: [PlayersService]
  })
export class PlayersModule {}
