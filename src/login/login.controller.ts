import { Controller, Get, Post, Body, UnauthorizedException, Req, Request } from '@nestjs/common';
import { User } from '../schemas/users.schema'; 
import * as bcrypt from 'bcrypt';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from '../../constants';

@Controller('login')
export class LoginController {
    constructor(@InjectModel(User) private readonly userModel: ReturnModelType<typeof User>) {}

    @Post()
    async login(@Body("email") email:string,
          @Body("password") plaintextPassword:string,
          @Req() request: Request) {
            console.log("requisição", request)
            const user = await this.userModel.findOne({email})
            if(!user){
                console.log("user doesnt exist on the database", user.email);
                throw new UnauthorizedException();
            }
            return new Promise((resolve, reject) => {
                console.log("plain: ", plaintextPassword, "hash: ", user.password);
                const verif = bcrypt.compareSync(plaintextPassword, user.password);
                if(verif == false){
                            reject(new UnauthorizedException());
                        }
                        const authJwtToken = jwt.sign({id: user._id, name: user.name, email, bday: user.bday, players: user.players}, JWT_SECRET);
                        resolve({authJwtToken});
                    }        
                );    
    }
}