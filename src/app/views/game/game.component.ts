import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NameDialogComponent } from './../../shared/name-dialog/name-dialog.component';
import * as signalr from '@microsoft/signalr';
import { ActivatedRoute, Router } from '@angular/router';
import { GameOptionsService, OpcaoJogador } from 'src/app/service/game-options.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  constructor(
    public diaLog: MatDialog,
    public snackBar: MatSnackBar,
    public ref: ChangeDetectorRef,
    public activateRoute: ActivatedRoute,
    private gameOptionService: GameOptionsService,
    private router: Router
  ) { 
   // this.openDialog();
  }
//http://jogovelhagfavarelli.azurewebsites.net/chat
  connection = new signalr.HubConnectionBuilder()
  .withUrl("https://velhagfavarelli.azurewebsites.net/chat")
  .build();
  jogadorNumero: string;
  opcaoJogador: string;
  casa: any = [];
  gameId: string;
  gameOption: OpcaoJogador;
  enableMessageLoading: boolean = false;
  enableMessageFriendConnect: boolean = false;

  ngOnInit(): void {    
    this.gameOption = this.gameOptionService.getOpcaoJogador();
    this.enableMessageLoading = this.gameOption.tipoJogador === "jogador2";
    this.opcaoJogador =  this.gameOption.opcao;

    this.activateRoute.paramMap.subscribe(params => {
      this.gameId = params.get("gameId");
      this.jogadorNumero = params.get("jogadorNumero");
      this.startConnection();
    });
  }

  startConnection() {
    this.connection
    .start()
    .then((data: any) => {
      this.connection.invoke('JoinGroup', this.gameId, this.opcaoJogador, this.gameOption.tipoJogador).then(() => {
        this.connection.send("getgroup", this.gameId).then();
      });
    });
    
    this.connection.on("jogada", (data: string) => {
      let jogada = data.split('-');
      this.casa[jogada[1]] = jogada[0];
      
      if(this.gameOption.tipoJogador !== jogada[2]) {
        this.enableMessageLoading = false;
      }

      if (jogada[3]) {
        alert(`Jogador ${jogada[3]} venceu !!!`);
      }
      
      this.ref.detectChanges();
    });

    this.connection.on("getgroup", (data: any) => {
      console.log(data.length < 2);
      this.enableMessageFriendConnect = data.length < 2;
      this.ref.detectChanges();
    });
  }

  jogar(casa: number) {
    if (!this.enableMessageLoading && !this.enableMessageFriendConnect) {
      this.enableMessageLoading = true;
      this.connection.send("jogada", this.gameId, this.gameOption.tipoJogador, casa).then();
    }
  }
}
