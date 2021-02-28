import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Nota, NotaDocument } from '../schemas/notas.schema';
import fs = require('fs');


@Injectable()
export class NotasService {

  constructor(@InjectModel(Nota.name) private NotaModel: Model<NotaDocument>) {}

  async create(createNota): Promise<Nota> {
    let base64Pdf = createNota.anexopdf.split(';base64,').pop();
    let type = "pdf"
    let newFileName = `${createNota.fornecedor} ${createNota.numero}.${type}`;
      const file = await fs.writeFile('./anexos/' + newFileName, base64Pdf, { encoding: 'base64' }, function (err) {
      });

    createNota.anexo = `localhost:3001/notas/anexos/${newFileName}`;
    const createdUser = new this.NotaModel(createNota);
    return await createdUser.save();
  }

  async getNotas(nota){
        if(nota === "empty"){
          let response = await this.NotaModel.find().lean();
          response.map((single,i)=>{
              response[i]["id"] = response[i]._id 
              let datestring = response[i].vencimento.toISOString();
              response[i]["vencimentoconverted"] = datestring.slice(0,10)
          })
          return response  
          }
        if(nota !== "empty"){
          let response = await this.NotaModel.find({numero: nota }).lean();
          response.map((single,i)=>{
              response[i]["id"] = response[i]._id 
              let datestring = response[i].vencimento.toISOString();
              response[i]["vencimentoconverted"] = datestring.slice(0,10)
          })
          return response  
        }   
      }

}
