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
  protected config: any;
  constructor(w: number[][], u: number[], public logRed: logRedService,public analitic: ReadFileService) {
    this.w = w;
    this.u = u;
    this.analitic.analiticFile.subscribe(resp => {
      this.EPS = resp;
    });
  }

  public sleep(time: number) {
    return new Promise(r => setTimeout(r, time));
  }

  abstract dataPerceptron(data: FormGroup);

  abstract entrenar(data: any);

  download(array: any,namefile: string) {
    this.exportFile(array, namefile);
  }

  exportFile( rows, fileTitle?) {

    const jsonObject = JSON.stringify(rows);
    const csv = '\ufeff' + this.convertToCSV(jsonObject); // support Chinese

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileTitle || 'data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  /* CSV: convert json to json */
  convertToCSV(objArray): string {
    return objArray.toString();
  }
}
