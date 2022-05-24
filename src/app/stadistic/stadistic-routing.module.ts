import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StadisticPage } from './stadistic.page';

const routes: Routes = [
  {
    path: '',
    component: StadisticPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StadisticPageRoutingModule {}
