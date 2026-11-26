
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Estrutura de uma movimentação
export interface Movimentacao {
  _id?: string;
  descricao: string;
  tipo: 'Receita' | 'Despesa';
  categoria: string;
  valor: number;
  data: string;
}

@Injectable({
  providedIn: 'root'
})
export class MovimentacoesService {

  private apiUrl = 'http://localhost:3000/movimentacoes';

  constructor(private http: HttpClient) { }

  // Listar movimentações
  listar(): Observable<Movimentacao[]> {
    return this.http.get<Movimentacao[]>(this.apiUrl);
  }

  // Cadastrar movimentação
  cadastrar(movimentacao: Movimentacao): Observable<Movimentacao> {
    return this.http.post<Movimentacao>(
      this.apiUrl,
      movimentacao
    );
  }

  // Editar movimentação
  editar(
    id: string,
    movimentacao: Movimentacao
  ): Observable<Movimentacao> {
    return this.http.put<Movimentacao>(
      `${this.apiUrl}/${id}`,
      movimentacao
    );
  }

  // Excluir movimentação
  excluir(id: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }
}
