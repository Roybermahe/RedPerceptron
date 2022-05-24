import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class logRedService {
  private _logRead = new BehaviorSubject([]);

  public logList = this._logRead.asObservable();

  up(message: string) {
    const data = [ ...this._logRead.getValue(), message ];
    this._logRead.next(data);
  }
}
