import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class logRedService {
  private _logRead = new BehaviorSubject([]);
  private _labels = new BehaviorSubject([]);
  private _data = new BehaviorSubject([] as { data: number[]; label: string}[]);

  public logList = this._logRead.asObservable();
  public labels = this._labels.asObservable();
  public data = this._data.asObservable();

  up(message: string) {
    const data = [ ...this._logRead.getValue(), message ];
    this._logRead.next(data);
  }

  upLabels(lbl: string) {
    const data = [ ...this._labels.getValue(), lbl ];
    this._labels.next(data);
  }

  upData(data: { data: number; label: string}) {
   const chData = this._data.getValue();
   const findData = chData.find(i => i.label.includes(data.label));
   if(findData) {
     findData.data.push(data.data);
   } else {
     chData.push({ data: [data.data], label: data.label});
   }
   this._data.next(chData);
  }

  cleanData() {
    this._data.next([]);
  }
}
