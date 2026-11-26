
import {Component,OnInit, inject, ChangeDetectorRef} from '@angular/core';

import {DatePipe,CurrencyPipe} from '@angular/common';


import {
  MovimentacoesService,
  Movimentacao
} from '../../services/movimentacoes.spec';

@Component({
  selector: 'app-movimentacoes',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './movimentacoes.html',
  styleUrl: './movimentacoes.css'
})
export class Movimentacoes implements OnInit {

  private service = inject(MovimentacoesService);
  private cdr = inject(ChangeDetectorRef);

  movimentacoes: Movimentacao[] = [];

  ngOnInit(): void {
    this.listarMovimentacoes();
  }

  listarMovimentacoes(): void {
    this.service.listar().subscribe({
      next: (dados) => {
        this.movimentacoes = dados;
        this.cdr.detectChanges();
},
      error: (erro) => {
        console.error('Erro ao buscar movimentações:', erro);
      }
    });
  }
}
