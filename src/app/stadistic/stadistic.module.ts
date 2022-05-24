import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StadisticPageRoutingModule } from './stadistic-routing.module';

import { StadisticPage } from './stadistic.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StadisticPageRoutingModule
  ],
  declarations: [StadisticPage]
})
export class StadisticPageModule {}
