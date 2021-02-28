import {BadRequestException, Injectable, NestMiddleware} from '@nestjs/common';
import { MiddlewareBuilder } from '@nestjs/core';
import {Request, Response} from "express";
import * as jwt from 'jsonwebtoken';
import { UsersService } from 'src/users/users.service';
import {JWT_SECRET} from '../constants';


@Injectable()
export class GetUserMiddleware implements NestMiddleware {
    constructor(private readonly usersService: UsersService) { }

    async use(req: Request, res: Response, next: () => void){
        const authJwtToken = req.headers.authorization;
        if(!authJwtToken) {
            next();
            return;
        }

        try {
            const user = jwt.verify(authJwtToken, JWT_SECRET);

            if (user) {

                const updatedToken = await this.usersService.isUpdated(user);
                console.log(updatedToken)
                if(updatedToken === 1){
                    req["user"] = user;
                    next();
                    return;
                }
                if(updatedToken === 0){
                    return res.json({
                          status: 'error',
                          code: 2,
                          message: `Token Desatualizado, realizar novo Login`,         
                    })
                }
        }
    }
        catch(err) {
            console.log("Error handling authentication JWT: ", err);
        }
        next();
    }

}