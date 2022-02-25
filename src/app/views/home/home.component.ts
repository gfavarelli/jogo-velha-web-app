import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as signalr from '@microsoft/signalr';
import { NameDialogComponent } from './../../shared/name-dialog/name-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Alert } from 'selenium-webdriver';
import { GameOptionsService } from 'src/app/service/game-options.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  

  constructor(public diaLog: MatDialog,
              public snackBar: MatSnackBar,
              public ref: ChangeDetectorRef,
              public router: Router,
              private gameOption: GameOptionsService
    ) { 
  }

  public opcao: string;
  public gameIdInput: string;
  private groupInitial = "GAME-";
  public opcaoSelecionadaX: boolean = false;
  public opcaoSelecionadaO: boolean = false;

  ngOnInit(): void {
  }

  selecionarOpcao(opcaoDeEscolha: string) {
    if(opcaoDeEscolha === 'X') {
      this.opcaoSelecionadaX = true;
      this.opcaoSelecionadaO = false;
    }

    if(opcaoDeEscolha === 'O') {
      this.opcaoSelecionadaO = true;
      this.opcaoSelecionadaX = false;
    }
    this.opcao = opcaoDeEscolha;
  }

  navigateToGate() {

    if (this.gameIdInput) {
      this.gameIdInput = this.gameIdInput.toUpperCase();
      this.gameOption.setOpcaoJogador(this.opcao, "jogador2");
      this.router.navigate(['/game', this.gameIdInput]);
      return;
    }

    if(!this.opcao) {
      alert('Selecione uma opção');
      return;
    }
    
    const groupName = `${this.groupInitial}${new Date().getDay()}${new Date().getMinutes()}${new Date().getMilliseconds()}`
    this.gameOption.setOpcaoJogador(this.opcao, "jogador1");
    this.router.navigate(['/game', groupName]);
  }
}
