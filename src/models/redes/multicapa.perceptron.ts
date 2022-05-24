import {AbstractRedPerceptron} from '../base/RedPerceptron.base';
import {FormGroup, Validators} from '@angular/forms';

export class MulticapaPerceptron extends AbstractRedPerceptron {
  entrenar(data: any) {
  }

  dataPerceptron(data: FormGroup) {
    this.config = data;
  }
}
