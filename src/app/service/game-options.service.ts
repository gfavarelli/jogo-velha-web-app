import { Injectable } from '@angular/core';

export interface OpcaoJogador {
  tipoJogador?: string, 
  opcao?: string
}

@Injectable({
  providedIn: 'root'
})
export class GameOptionsService {

  constructor() { }
  private opcaoJogador: OpcaoJogador = {};

  public setOpcaoJogador(opcao: string, tipoJogador: string): void {
    this.opcaoJogador =  {
      tipoJogador: tipoJogador,
      opcao: opcao
    };
  }

  public getOpcaoJogador(): OpcaoJogador {
    return this.opcaoJogador;
  }
  
}
