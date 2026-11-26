import { Routes } from '@angular/router';
import { Movimentacoes } from './components/movimentacoes/movimentacoes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'movimentacoes',
    pathMatch: 'full'
  },
  {
    path: 'movimentacoes',
    component: Movimentacoes
  }
];