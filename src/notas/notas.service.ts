import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Nota, NotaDocument } from '../schemas/notas.schema';
import fs = require('fs');
import axios from "axios";
import FormData = require('form-data');


@Injectable()
export class NotasService {

  constructor(@InjectModel(Nota.name) private NotaModel: Model<NotaDocument>) {}

  async login(data) {
    let success = {}
    const formData = new FormData();
    formData.append('login', data.login);
    formData.append('senha', data.senha);   
    await axios.post(`https://tiliflow.tiliweb.com.br/triata/ajaxLoginMan.php?i=2650`, formData, {
      headers: formData.getHeaders()
  })
    .then(res => {
      success = {
        "PHPSESSID": res.headers["set-cookie"].toString().slice(10,36),
        "cookieLogin": data.login
      }
      console.log(success)
      return;
    })
    .catch((er) => {
      console.log("erro")
        return;
      })
    console.log("sucesso de fora",success)
    return success;
  }
  
  async lancatriare(data) {
    console.log("entrei no lanca triare")
    let success = {}
    const formData = new FormData();
    formData.append('request', 1);
    let headerscomplete = formData.getHeaders()
    headerscomplete = {
      ...headerscomplete,
      'cookie': "PHPSESSID="+data.PHPSESSID
    }
    console.log(headerscomplete)
    await axios.post(`https://tiliflow.tiliweb.com.br/sistema/ProcessoCad.php?modelo_versao_id=0043001&tarefa_id=00430010001&cod_execucao=1`, formData, {
      headers: headerscomplete
  })
    .then(res => {
      return;
    })
    .catch((er) => {
      console.log("erro")
        return;
      })
    console.log("sucesso de fora",success)
    return success;
  } 

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
