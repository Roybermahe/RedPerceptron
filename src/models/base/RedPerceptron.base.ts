import {FormBuilder, FormGroup} from '@angular/forms';
import {logRedService} from '../../services/log-red.service';
import {ReadFileService} from '../../services/read-file.service';
import {DataRed} from '../data.red';

export abstract class AbstractRedPerceptron {

  protected EPS = {inputs: 0, outputs: 0, patterns: 0} as DataRed;
  protected somaRes: number[] = [];
  protected yResults: number[] = [];
  protected ElResults: number[] = [];
  protected Ep: number;
  protected w: number[][] = [];
  protected u: number[] = [];
  protected config: FormGroup;
  constructor(w: number[][], u: number[], public logRed:logRedService,public analitic:ReadFileService) {
    this.w = w;
    this.u = u;
    this.analitic.analiticFile.subscribe(resp => {
      this.EPS = resp;
    });
  }

  abstract dataPerceptron(data: FormGroup);

  abstract entrenar(data: any);
}
