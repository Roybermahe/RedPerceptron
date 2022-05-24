import { Component, OnInit } from '@angular/core';
import {logRedService} from '../../services/log-red.service';
import {ReadFileService} from '../../services/read-file.service';
import {ChartDataset, ChartOptions} from 'chart.js';

@Component({
  selector: 'app-stadistic',
  templateUrl: './stadistic.page.html',
  styleUrls: ['./stadistic.page.scss'],
})
export class StadisticPage implements OnInit {

  public lineChartData: ChartDataset[] = [];
  public lineChartLabels = [];
  public lineChartOptions = {
    responsive: true,
  };

  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];
  constructor(
    private logRed: logRedService,
    private analitic: ReadFileService
  ) { }

  ngOnInit() {
    this.logRed.labels.subscribe(resp => {
      this.lineChartLabels = resp;
    });
    this.logRed.data.subscribe(resp => {
      this.lineChartData = resp;
    });
  }

}
