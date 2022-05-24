import { Component, OnInit } from '@angular/core';
import {ReadFileService} from '../../services/read-file.service';
import {DataRed} from '../../models/data.red';
import {logRedService} from '../../services/log-red.service';
import {PerceptronService} from '../../models/base/perceptron.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AbstractRedPerceptron} from '../../models/base/RedPerceptron.base';
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
})
export class ConfiguracionPage implements OnInit {

  datosDeRed: DataRed;
  matrizDePeso: number[][] = [];
  matrizDePesoString: string;

  vectorDeUmbrales: number[] = [];
  vectorUmbralesString: string;

  formUnicapa: FormGroup;
  perceptron: AbstractRedPerceptron;
  constructor(
    private perceptronSvc: PerceptronService,
    private dataAnalitics: ReadFileService,
    private logRed: logRedService,
    private alertCtl : AlertController,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.formUnicapa =  this.fb.group({
      red: ['unicapa'],
      funcionActivacion:['escalon'],
      // definición de el algoritmo de entrenamiento
      reglaDelta: [ true],
      // definición de los parametros de entrenamiento
      numIteraciones: [10],
      rata: [0, [Validators.required, Validators.min(0), Validators.max(1)]],
      errMax: [0, [Validators.required, Validators.min(0), Validators.max(0.99999999999)]]
    });
    this.dataAnalitics.analiticFile.subscribe(resp => {
      this.datosDeRed = resp;
      this.matrizDePeso = [];
      this.vectorDeUmbrales = [];
      this.llenarMatrizDePeso(resp.inputs, resp.outputs);
      this.llenarVectorDeUmbrales(resp.outputs);
      this.perceptron = this.perceptronSvc.buildPerceptron('unicapa', this.matrizDePeso, this.vectorDeUmbrales);
      this.perceptronSvc.getForms(this.perceptron, this.formUnicapa);
    });
  }

  private llenarMatrizDePeso(entradas: number, salidas: number) {
    this.matrizDePesoString = '';
    for (let i = 0; i < entradas; i++) {
      const line = [];
      this.matrizDePesoString += this.matrizDePesoString.length > 0 ? '\n':'';
      for (let j = 0; j < salidas; j++) {
        const max = 1;
        const min = -1;
        const value =  +(Math.random() * (+max - +min) + +min).toFixed(2);
        line.push(value);
        this.matrizDePesoString += `[${value}]`;
      }
      this.matrizDePeso.push(line);
    }
    this.logRed.up('Matriz de pesos:' + JSON.stringify(this.matrizDePeso));
  }

  private llenarVectorDeUmbrales(salidas: number) {
    this.vectorUmbralesString = '';
    for (let i = 0; i < salidas; i++) {
      const max = 1;
      const min = -1;
      const value =  +(Math.random() * (+max - +min) + +min).toFixed(2);
      this.vectorDeUmbrales.push(value);
      this.vectorUmbralesString += `[${value}]\n`;
    }
    this.logRed.up('Vector de umbrales:' + JSON.stringify(this.vectorDeUmbrales));
  }

  generateRedData($event: any) {
    this.perceptron = this.perceptronSvc.buildPerceptron($event.target.value, this.matrizDePeso, this.vectorDeUmbrales);
    this.perceptronSvc.getForms(this.perceptron, this.formUnicapa);
  }

  async submitUnicapa() {
    const value = this.formUnicapa.value;
    const condition1 = 0 < value.rata && value.rata <= 1;
    const condition2 = 0 <= value.errMax && value.errMax < 1;
    try{
      if (condition1 === false || condition2 === false) {
        throw new Error('Valores no validos');
      }
      this.perceptron = this.perceptronSvc.buildPerceptron('unicapa', this.matrizDePeso, this.vectorDeUmbrales);
      this.perceptronSvc.getForms(this.perceptron, this.formUnicapa);
      this.logRed.up('Iniciando entrenamiento');
      this.perceptron.entrenar({});
    } catch (e) {
      const alert = await this.alertCtl.create({message: 'Por favor corrija los parametros de entrenamiento', mode: 'ios'});
      await alert.present();
    }
  }
}
