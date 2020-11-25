import { Controller, Get, Post, Body, UnauthorizedException, Req, Request, HttpException, HttpStatus } from '@nestjs/common';
import { User } from '../schemas/users.schema'; 
import * as bcrypt from 'bcrypt';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from '../constants';

@Controller('login')
export class LoginController {
    constructor(@InjectModel(User) private readonly userModel: ReturnModelType<typeof User>) {}

    @Post()
    async login(@Body("email") email:string,
          @Body("password") plaintextPassword:string,
          @Req() request: Request) {
            const user = await this.userModel.findOne({email})
            if(!user){
                throw new HttpException({
                    status: HttpStatus.UNAUTHORIZED,
                    message: 'Email não cadastrado',
                  }, HttpStatus.UNAUTHORIZED);
            }
            return new Promise((resolve, reject) => {
                console.log("plain: ", plaintextPassword, "hash: ", user.password);
                const verif = bcrypt.compareSync(plaintextPassword, user.password);
                if(verif == false){
                    throw new HttpException({
                        status: HttpStatus.UNAUTHORIZED,
                        message: 'Senha incorreta',
                      }, HttpStatus.UNAUTHORIZED);
                        }
                        const authJwtToken = jwt.sign({id: user._id, name: user.name, email, bday: user.bday, players: user.players}, JWT_SECRET);
                        resolve({authJwtToken});
                    }        
                );    
    }
}