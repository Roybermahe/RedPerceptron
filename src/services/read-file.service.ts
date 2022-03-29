import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {environment} from '../environments/environment';
import {DataRed} from '../models/data.red';
import {logRedService} from './log-red.service';

@Injectable({
  providedIn: 'root'
})
export class ReadFileService {
  private storage = sessionStorage.getItem(environment.storageRedData) !== null ?
    JSON.parse(sessionStorage.getItem(environment.storageRedData)) : [];
  private _dataFile = new BehaviorSubject(this.storage);
  private _dataAnalitics = new BehaviorSubject({inputs: 0, outputs: 0, patterns: 0} as DataRed);

  public contentFile = this._dataFile.asObservable();
  public analiticFile = this._dataAnalitics.asObservable();
  constructor(private logRed: logRedService) {
    this._dataFile.subscribe(resp => {
      this.logRed.up('Se obtiene la data almacenada');
      this.logRed.up(resp + '');
      const arr = sessionStorage.getItem(environment.prevStorageRed) !== null ?
        JSON.parse(sessionStorage.getItem(environment.prevStorageRed)) : [];
      if(arr.length > 0) {
        // analizamos patrones
        this.logRed.up('1) analizamos patrones');
        arr.pop();
        const columns = arr.reverse().pop();
        const inputs = columns.split(',').filter(x => x.includes('X') || x.includes('x'));
        const outputs = columns.split(',').filter(x => x.includes('Y') || x.includes('y'));
        
        const befArr = arr;
        
        const set = new Set(befArr);
        
        const patterns = set.size;
        const patternsArr = ([...set]).map((rep: any) => rep.split(',')).map(slc => slc.slice(0, inputs.length ));
        
        this.logRed.up('patrones: '+ patterns);
        this.logRed.up(patternsArr + '')
        // analizamos entradas
        this.logRed.up('entradas: '+ inputs.length);
        this.logRed.up(inputs);
        // analizamos salidas
        const outputsArr = ([...set]).map((rep: any) => rep.split(',')).map(slc => slc.slice(outputs.length));
        this.logRed.up('salidas: '+ outputs.length);
        this.logRed.up(outputs);
        this.logRed.up(outputsArr + '');
        this._dataAnalitics.next({ inputs: inputs.length, inputsArray: inputs, patterns, patternsArray: patternsArr, outputs: outputs.length, outputsArray: outputs });
      }
    });
  }

  up(file: any) {
    this.logRed.up('archivo subido:' + file.name);
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const content = fileReader.result as string;
      sessionStorage.setItem(environment.prevStorageRed, JSON.stringify(content.split('\n')));
      const completeArr = content.split('\n').map(val => val.split(',' || ';' || '|'));
      completeArr.pop();
      this.logRed.up('datos leidos:' + completeArr);
      sessionStorage.setItem(environment.storageRedData, JSON.stringify(completeArr));
      this._dataFile.next(completeArr);
    };
    fileReader.readAsText(file);
  }
}
