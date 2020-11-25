import { ArgumentsHost, Catch, ConflictException, ExceptionFilter } from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export default class MongoExceptionFilter implements ExceptionFilter {
    catch(exception: MongoError, host: ArgumentsHost) {
    switch (exception.code) {
      case 11000:
        const response = host.switchToHttp().getResponse();
        response.status(400).json({message: "Email já cadastrado"});
    }
  }
}