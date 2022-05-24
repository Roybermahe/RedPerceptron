import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StadisticPageRoutingModule } from './stadistic-routing.module';

import { StadisticPage } from './stadistic.page';
import {NgChartsModule} from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StadisticPageRoutingModule,
    NgChartsModule
  ],
  declarations: [StadisticPage]
})
export class StadisticPageModule {}
