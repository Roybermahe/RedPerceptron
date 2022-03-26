import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DataAnalisisPageRoutingModule } from './data-analisis-routing.module';

import { DataAnalisisPage } from './data-analisis.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DataAnalisisPageRoutingModule
  ],
  declarations: [DataAnalisisPage]
})
export class DataAnalisisPageModule {}
