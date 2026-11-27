
import {Component,OnInit, inject, ChangeDetectorRef} from '@angular/core';

import {DatePipe,CurrencyPipe, } from '@angular/common';


import {
  MovimentacoesService,
  Movimentacao
} from '../../services/movimentacoes.spec';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-movimentacoes',
  imports: [DatePipe, CurrencyPipe, FormsModule],
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

  categoriaSelecionada: string = 'Todas';

  // Lista de categorias disponíveis
  categorias: string[] = [
    'Trabalho',
    'Alimentação',
    'Transporte',
    'Moradia',
    'Lazer',
    'Saúde',
    'Educação',
    'Outros'
  ];

  get movimentacoesFiltradas(): Movimentacao[] {
  if (this.categoriaSelecionada === 'Todas') {
    return this.movimentacoes;
  }

  return this.movimentacoes.filter(
    movimentacao =>
      movimentacao.categoria === this.categoriaSelecionada
  );
}

  get totalReceitas(): number {
  return this.movimentacoes
    .filter(m => m.tipo === 'Receita')
    .reduce((total, m) => total + m.valor, 0);
}

get totalDespesas(): number {
  return this.movimentacoes
    .filter(m => m.tipo === 'Despesa')
    .reduce((total, m) => total + m.valor, 0);
}

get saldo(): number {
  return this.totalReceitas - this.totalDespesas;
}

    corCategoria(categoria: string): string {
  switch (categoria) {
    case 'Trabalho':
      return '#dbeafe';

    case 'Alimentação':
      return '#fef3c7';

    case 'Transporte':
      return '#e0e7ff';

    case 'Moradia':
      return '#fce7f3';

    case 'Lazer':
      return '#dcfce7';

    case 'Saúde':
      return '#fee2e2';

    case 'Educação':
      return '#ede9fe';

    default:
      return '#e5e7eb';
  }
}
    novaMovimentacao: Movimentacao = {
  descricao: '',
  tipo: 'Despesa',
  categoria: 'Outros',
  valor: 0,
  data: ''
};

// Guarda o ID da movimentação que está sendo editada
idEditando: string | null = null;

   cadastrarMovimentacao(): void {

  const dados: Movimentacao = {
    descricao: this.novaMovimentacao.descricao,
    tipo: this.novaMovimentacao.tipo,
    categoria: this.novaMovimentacao.categoria,
    valor: Number(this.novaMovimentacao.valor),
    data: this.novaMovimentacao.data
  };

  this.service.cadastrar(dados).subscribe({

    next: (resposta) => {

      // Atualiza a lista com a movimentação cadastrada
      this.listarMovimentacoes();

      // Limpa o formulário
      this.novaMovimentacao = {
        descricao: '',
        tipo: 'Despesa',
        categoria: 'Outros',
        valor: 0,
        data: ''
      };

      // Atualiza a tela
      this.cdr.detectChanges();

      alert('Movimentação cadastrada com sucesso!');
    },

    error: (erro) => {
      console.error('Erro ao cadastrar:', erro);
      alert('Não foi possível cadastrar a movimentação.');
    }

  });
}

editarMovimentacao(movimentacao: Movimentacao): void {

  if (!movimentacao._id) {
    return;
  }

  this.idEditando = movimentacao._id;

  // Coloca os dados selecionados no formulário
  this.novaMovimentacao = {
    descricao: movimentacao.descricao,
    tipo: movimentacao.tipo,
    categoria: movimentacao.categoria,
    valor: movimentacao.valor,
    data: movimentacao.data
  };

}

salvarEdicao(): void {

  if (!this.idEditando) {
    return;
  }

  this.service.editar(
    this.idEditando,
    this.novaMovimentacao
  ).subscribe({

    next: () => {
      alert('Movimentação alterada com sucesso!');

      this.idEditando = null;

      this.novaMovimentacao = {
        descricao: '',
        tipo: 'Despesa',
        categoria: 'Outros',
        valor: 0,
        data: ''
      };

      this.listarMovimentacoes();
    },

    error: (erro) => {
      console.error('Erro ao editar:', erro);
      alert('Não foi possível editar a movimentação.');
    }

  });

}

cancelarEdicao(): void {

  this.idEditando = null;

  this.novaMovimentacao = {
    descricao: '',
    tipo: 'Despesa',
    categoria: 'Outros',
    valor: 0,
    data: ''
  };

}

excluirMovimentacao(movimentacao: Movimentacao): void {

  if (!movimentacao._id) {
    return;
  }

  const confirmar = confirm(
    'Tem certeza que deseja excluir esta movimentação?'
  );

  if (!confirmar) {
    return;
  }

  this.service.excluir(movimentacao._id).subscribe({

    next: () => {
      alert('Movimentação excluída com sucesso!');

      this.listarMovimentacoes();
    },

    error: (erro) => {
      console.error('Erro ao excluir:', erro);
      alert('Não foi possível excluir a movimentação.');
    }

  });

}

}
