import { Component, OnInit } from '@angular/core';
import {logRedService} from "../../services/log-red.service";

@Component({
  selector: 'app-log-red',
  templateUrl: './log-red.page.html',
  styleUrls: ['./log-red.page.scss'],
})
export class LogRedPage implements OnInit {

  public listLog = [] as string[];
  constructor(
    private logRed: logRedService
  ) { }

  ngOnInit() {
    this.logRed.logList.subscribe(resp => {
      this.listLog = resp;
    });
  }

}
