import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataAnalisisPage } from './data-analisis.page';

const routes: Routes = [
  {
    path: '',
    component: DataAnalisisPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataAnalisisPageRoutingModule {}
