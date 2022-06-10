import { Component, OnInit } from '@angular/core';
import {ReadFileService} from '../../services/read-file.service';
import {DataRed} from '../../models/data.red';
import {logRedService} from '../../services/log-red.service';
import {PerceptronService} from '../../models/base/perceptron.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AbstractRedPerceptron} from '../../models/base/RedPerceptron.base';
import {AlertController} from '@ionic/angular';
import {Router} from '@angular/router';

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
  formMulticapa: FormGroup;
  formAdaline: FormGroup;
  formBackPropagation: FormGroup;
  constructor(
    private perceptronSvc: PerceptronService,
    private dataAnalitics: ReadFileService,
    private logRed: logRedService,
    private alertCtl: AlertController,
    private router: Router,
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
    this.formAdaline = this.fb.group({
      red: ['adaline'],
      funcionActivacion:['lineal'],
      // definición de el algoritmo de entrenamiento
      reglaDelta: [ true],
      // definición de los parametros de entrenamiento
      numIteraciones: [10],
      rata: [0, [Validators.required, Validators.min(0), Validators.max(1)]],
      errMax: [0, [Validators.required, Validators.min(0), Validators.max(0.99999999999)]]
    });
    this.formMulticapa = this.fb.group({
      red: ['multicapa'],
      // definición de el algoritmo de entrenamiento
      capasOcultas: this.fb.array([]),
      reglaDelta: [ true],
      funcionActivacion:[''],
      // definición de los parametros de entrenamiento
      numIteraciones: [10],
      rata: [0, [Validators.required, Validators.min(0), Validators.max(1)]],
      errMax: [0, [Validators.required, Validators.min(0), Validators.max(0.99999999999)]]
    });
    this.formBackPropagation = this.fb.group({
      red: ['backpropagation'],
      funcionActivacion:[''],
      // definición de el algoritmo de entrenamiento
      reglaDelta: [ false ],
      propagacionInversa: [true],
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
    });
  }

  private llenarMatrizDePeso(entradas: number, salidas: number) {
    this.matrizDePesoString = '';
    this.matrizDePeso = [];
    for (let i = 0; i < entradas; i++) {
      const line = [];
      this.matrizDePesoString += this.matrizDePesoString.length > 0 ? '\n':'';
      for (let j = 0; j < salidas; j++) {
        const max = -0.1;
        const min = 0.1;
        const value =  +(Math.random() * (+max - +min) + +min).toFixed(2);
        line.push(value);
        this.matrizDePesoString += `[${value}]`;
      }
      this.matrizDePeso.push(line);
    }
    this.logRed.up('Matriz de pesos:' + JSON.stringify(this.matrizDePeso));
  }

  private llenarVectorDeUmbrales(salidas: number) {
    this.vectorDeUmbrales = [];
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

  generateMatriz() {
    this.llenarVectorDeUmbrales(this.datosDeRed.outputs);
    this.llenarMatrizDePeso(this.datosDeRed.inputs, this.datosDeRed.outputs);
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
      this.logRed.up('Iniciando entrenamiento');
      this.perceptron = this.perceptronSvc.buildPerceptron('unicapa', this.matrizDePeso, this.vectorDeUmbrales);
      this.perceptronSvc.getForms(this.perceptron, this.formUnicapa);
      this.router.navigateByUrl('/stadistic').then(async () => {
        await this.perceptron.entrenar({});
      });
    } catch (e) {
      const alert = await this.alertCtl.create({message: 'Por favor corrija los parametros de entrenamiento', mode: 'ios'});
      await alert.present();
    }
  }


  addCapas($event: any) {
    const capas = $event.target.value;
    const capasOcultas = this.formMulticapa.get('capasOcultas');
    (capasOcultas as FormArray).clear();
    for (let i = 0; i < capas; i++) {
      (capasOcultas as FormArray).push(this.fb.group({
        capa: [i],
        activacion: [''],
        neurons: [1, [Validators.min(1)]]
      }));
    }
  }

  formArr() {
    return ((this.formMulticapa.get('capasOcultas') as FormArray).controls as FormGroup[]);
  }

  getControl(i) {
    return (this.formMulticapa.get('capasOcultas') as FormArray).controls[i];
  }

  async submitMulticapa() {
    const value = this.formMulticapa.value;
    const condition1 = 0 < value.rata && value.rata <= 1;
    const condition2 = 0 <= value.errMax && value.errMax <= 0.1;
    const condition3 = value.capasOcultas.length > 0;
    try{
      if (condition1 === false || condition2 === false || condition3 === false) {
        throw new Error('Valores no validos');
      }
      this.perceptron = this.perceptronSvc.buildPerceptron('multicapa', [...this.matrizDePeso], [...this.vectorDeUmbrales]);
      this.perceptronSvc.getForms(this.perceptron, this.formMulticapa);
      this.logRed.up('Iniciando entrenamiento');
      await this.perceptron.entrenar({});
    } catch (e) {
      const alert = await this.alertCtl.create({message: 'Por favor corrija los parametros de entrenamiento', mode: 'ios'});
      await alert.present();
    }
  }

  submitAdaline() {

  }

  submitBackPropagation() {

  }
}
