import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogRedPageRoutingModule } from './log-red-routing.module';

import { LogRedPage } from './log-red.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LogRedPageRoutingModule
  ],
  declarations: [LogRedPage]
})
export class LogRedPageModule {}
