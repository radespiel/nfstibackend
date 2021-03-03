import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Nota, NotaDocument } from '../schemas/notas.schema';
import fs = require('fs');
import axios from "axios";
import FormData = require('form-data');
import { create } from 'domain';


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
      return;
    })
    .catch((er) => {
        return;
      })
    return success;
  }
  
  async lancatriare(data) {

////////////////////////////////////////////////////////////////////////////////////////// salva dados no processo do triare
    async function salvaprocesso(infodevolvida){
      function convertDate(dateString){
        var p = dateString.split(/\D/g)
        return [p[2],p[1],p[0] ].join("-")
      }
      data.vencimentoformatada = convertDate(data.vencimento);
      data.vencimentoformatada = data.vencimento.replace(/-/g,'/')
      const formData = new FormData();
      formData.append('id', infodevolvida.id);
      formData.append('processo_tarefa_id', infodevolvida.id);
      formData.append('amb_tarefa_id', infodevolvida.id);
      formData.append('modelo_versao_id', infodevolvida.modelo_versao_id);
      formData.append('tarefa_id', infodevolvida.tarefa_id);
      formData.append('processo_id', infodevolvida.processo_id);
      formData.append('amb_processo_id', infodevolvida.processo_id);
      formData.append('cod_execucao', 1);
      formData.append('salvar', 1);
      formData.append('btn_acionado', 0);
      formData.append('ide_tipo_tarefa', "I");
      formData.append('amb_link', "https://tiliflow.tiliweb.com.br/");
      formData.append('fornecedor', data.fornecedor);
      formData.append('cnpj', data.cnpj);
      formData.append('numero_nota', data.numero);
      formData.append('serie', data.serie);
      formData.append('valor_total', data.valor);
      formData.append('data_venc', data.vencimentoformatada);
      formData.append('cer', data.cer);
      formData.append('receb_fisico', data.receb);
      formData.append('observacao', data.obs);
      formData.append('desc_conta', data.carimbo);
      formData.append('anexo_nota', '');
      formData.append('label_anexo_nota', '');

      let headerscomplete = formData.getHeaders()
      headerscomplete = {
        ...headerscomplete,
        'cookie': "PHPSESSID="+data.PHPSESSID
      }
      await axios.post(`https://tiliflow.tiliweb.com.br/sistema/ProcessoMan.php?area=Painel&acao=G&alerta_salvar=on`, formData, {
        headers: headerscomplete
    })
      .then(res => {
        data = {
          ...data,
          triare: infodevolvida.processo_id        
        }
        return;
      })
      .catch((er) => {
      alert("algo deu errado!")
          return;
        })
    }
/////////////////////////////////////////////////////////// CRIA O PROCESSO NO TRIARE
    let infodevolvida = {}
    const formData = new FormData();
    formData.append('request', 1);
    let headerscomplete = formData.getHeaders()
    headerscomplete = {
      ...headerscomplete,
      'cookie': "PHPSESSID="+data.PHPSESSID
    }
    await axios.post(`https://tiliflow.tiliweb.com.br/sistema/ProcessoCad.php?modelo_versao_id=0043001&tarefa_id=00430010001&cod_execucao=1`, formData, {
      headers: headerscomplete
  })
    .then(res => {
      infodevolvida = {
      id: res.data.split('processo_tarefa_id=').pop().split('&')[0],
      processo_id: res.data.split('processo_id=').pop().split('&')[0],
      modelo_versao_id: res.data.split('modelo_versao_id=').pop().split('&')[0],
      tarefa_id: res.data.split('tarefa_id=').pop().split('&')[0]
      }
      data = {
        ...data,
        triare: infodevolvida["processo_id"]
      }
      salvaprocesso(infodevolvida);///////////////////////////////////////////////////////Envia infos para o salva processo
      return;
    })
    .catch((er) => {
    alert("algo deu errado!")
        return;
      })
/////////////////////////////////////////////////////////// LANÇA NO MONGODB
      let base64Pdf = data.anexopdf.split(';base64,').pop();
      let type = "pdf"
      let newFileName = `${data.fornecedor} ${data.numero}.${type}`;
        const file = await fs.writeFile('./anexos/' + newFileName, base64Pdf, { encoding: 'base64' }, function (err) {
        });
  
      data.anexo = `/notas/anexos/${newFileName}`;
      const createdUser = new this.NotaModel(data);
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
