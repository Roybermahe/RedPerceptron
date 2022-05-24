import { Injectable } from '@angular/core';
import {UnicapaPerceptron} from '../redes/unicapa.perceptron';
import {MulticapaPerceptron} from '../redes/multicapa.perceptron';
import {AbstractRedPerceptron} from './RedPerceptron.base';
import {logRedService} from '../../services/log-red.service';
import {ReadFileService} from '../../services/read-file.service';
import {FormGroup} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PerceptronService {
   constructor(private logRed: logRedService, private analitic: ReadFileService) {
   }

  buildPerceptron(name: string, w: number[][], u: number[]) {
    switch (name) {
      case 'multicapa':
        return new MulticapaPerceptron(w, u, this.logRed, this.analitic); break;
      default:
        return new UnicapaPerceptron(w, u, this.logRed, this.analitic);
    }
  }

  getForms(perceptron: AbstractRedPerceptron, data: FormGroup) {
    return perceptron.dataPerceptron(data);
  }
}
