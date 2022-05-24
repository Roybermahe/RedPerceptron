import {AbstractRedPerceptron} from '../base/RedPerceptron.base';
import {FormGroup, Validators} from '@angular/forms';
import {Layer, Network} from 'synaptic';

export class UnicapaPerceptron extends AbstractRedPerceptron {

  entrenar(data: any) {
    const inputLayer = new Layer(this.EPS.inputs);
    const outputLayer = new Layer(this.EPS.outputs);

    this.logRed.cleanData();
    inputLayer.project(outputLayer);

    const myRed = new Network({
      input: inputLayer,
      hidden: [],
      output: outputLayer
    });
    for (let iter = 0; iter < this.config.value.numIteraciones; iter++) {
      this.logRed.up('Iteración número:'+(iter+1));
      this.logRed.upLabels('Iter_'+(iter+1));
      for (let i = 0; i < this.EPS.inputs; i++) {
        const Xj = Array.from(this.EPS.patternsArray[i], x => +x);
        myRed.activate(Xj);
        this.AplicacionDeFuncionSoma(i);
        this.escalon(i);
        myRed.propagate(this.config.value.rata, this.yResults);
        this.erroresLineales(i);
        this.erroresDelPatron(i);
        this.logRed.upData({ data: this.Ep, label: 'Patron_'+(i+1)});
        this.modificacionPesosUmbrales(i);
      }
    }
  }

  dataPerceptron(data: FormGroup) {
    this.config = data;
  }

  private AplicacionDeFuncionSoma(index: number) {
    this.logRed.up('Paso 1: Aplicación de función Soma');
    const Xj = this.EPS.patternsArray[index];
    const results = [];
    for (let j = 0; j < this.EPS.outputs ; j++) {
      let soma = 0;
      let log = 'S'+(j+1)+'= [(';
      for (let i = 0; i < this.EPS.inputs; i++) {
        soma += (+Xj[i])*(this.w[i][j]);
        log += `(${(+Xj[i])} * ${this.w[i][j]})${ i === this.EPS.inputs - 1 ? '': ' + '}`;
      }
      soma = soma - this.u[j];
      results.push(soma);
      this.logRed.up(`${log}) - ${this.u[j]}] = ${soma}`);
    }
    this.somaRes = results;
  }

  private escalon(index: number) {
    this.logRed.up('Paso 2: Aplicación de función escalon');
    const yR = [];
    for(let i = 0; i < this.somaRes.length; i++) {
      const aplico = this.somaRes[i] >= 0 ? 1 : 0;
      yR.push(aplico);
      this.logRed.up(`Yr${i+1} = ${this.somaRes[i]} -->escalon--> ${aplico}`);
    }
    this.yResults = yR;
  }

  private erroresLineales(index: number) {
    this.logRed.up('Paso 3: Calculo de errores lineales');
    const yd = this.EPS.outputsArrContent[index];
    const elRes = [];
    for (let i = 0; i < yd.length ; i++) {
      const eli = yd[i] - this.yResults[i];
      elRes.push(eli);
      this.logRed.up(`El${i+1} = ${yd[i]} - ${this.yResults[i]} = ${eli}`);
    }
    this.ElResults = elRes;
  }

  private erroresDelPatron(index: number) {
    this.logRed.up('Paso 4: Error producido por el patron');
    let Ep = 0;
    let log = '';
    for(let i = 0; i < this.ElResults.length ; i++) {
      Ep = Math.abs(this.ElResults[i]);
      log += `|${this.ElResults[i]}|${ i === this.ElResults.length - 1 ? '': ' + '}`;
    }
    log.slice(log.length-1, log.length);
    this.Ep = Ep/this.EPS.outputs;
    this.logRed.up(`Ep = ${log} / ${this.EPS.outputs} = ${this.Ep}`);
  }

  private modificacionPesosUmbrales(index: number) {
    this.logRed.up('Paso 5: Modificación de W y U');
    const parameters = this.config.value;
    const yd = this.EPS.outputsArrContent[index];
    this.logRed.up('Modificación de W');
    for (let j = 0; j < this.EPS.inputs ; j++) {
      for (let i = 0; i < this.EPS.outputs; i++) {
        const nuevopeso = this.w[j][i] + parameters.rata*this.ElResults[i]*yd[i];
        this.logRed.up(`W[${j+1}][${i+1}] = ${this.w[j][i]} + ${parameters.rata}*${this.ElResults[i]}*${yd[i]} = ${nuevopeso}`);
        this.w[j][i] = nuevopeso;
      }
    }
    this.logRed.up('W = '+JSON.stringify(this.w));
    this.logRed.up('Modificación de U');
    for (let i = 0; i < this.EPS.outputs ; i++) {
      const nuevoumbral = this.u[i] + parameters.rata * this.ElResults[i];
      this.logRed.up(`U[${i}] = ${this.u[i]} + ${parameters.rata} * ${this.ElResults[i]} * 1 = ${nuevoumbral}`);
      this.u[i] = nuevoumbral;
    }
    this.logRed.up('U = '+JSON.stringify(this.u));
  }
}
