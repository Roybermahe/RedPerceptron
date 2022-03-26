import { Component, OnInit } from '@angular/core';
import {ReadFileService} from "../../services/read-file.service";
import {DataRed} from "../../models/data.red";

@Component({
  selector: 'app-data-analisis',
  templateUrl: './data-analisis.page.html',
  styleUrls: ['./data-analisis.page.scss'],
})
export class DataAnalisisPage implements OnInit {

  public dataAnalist: DataRed;
  constructor(
    private fileRead: ReadFileService
  ) { }

  ngOnInit() {
    this.fileRead.analiticFile.subscribe(resp => {
      this.dataAnalist = resp;
    });
  }

}
