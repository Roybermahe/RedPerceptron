import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'data-analisis',
    loadChildren: () => import('./data-analisis/data-analisis.module').then( m => m.DataAnalisisPageModule)
  },
  {
    path: 'log-red',
    loadChildren: () => import('./log-red/log-red.module').then( m => m.LogRedPageModule)
  },
  {
    path: 'configuracion',
    loadChildren: () => import('./configuracion/configuracion.module').then( m => m.ConfiguracionPageModule)
  },
  {
    path: 'stadistic',
    loadChildren: () => import('./stadistic/stadistic.module').then( m => m.StadisticPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
