import { Context } from "cordis";
import { globalAgent } from "http";
import { off } from "process";
import { logger } from "../../lobby/tools/Logger";
import { Player, cardConfig } from "./player"
import { Board, GameStage, Position, CardPara, Card, RequestSignal, SignalPara } from "./regulates/interfaces"

function randomsort(a: string, b: string): number {
  return Math.random() > .5 ? -1 : 1;
}
function rand(start: any,end: any){
	return parseInt(Math.random()*(end-start+1)+start);
}

export class GameState {
  board: Board = {};
  player: Player[] = [];
  global: {
    round: number,
    turn: number,
    stage: GameStage,
    result: Record<string, number> // 每名玩家的名次
  }
  totPlayer: number;
  req: (signal: RequestSignal) => Promise<CardPara>;
  gameEnd: () => void;
  constructor(player: string[], req: (signal: RequestSignal) => Promise<CardPara>, gameEnd: () => void) {
    this.gameEnd = gameEnd;
    this.req = req;
    this.totPlayer = player.length;
    for (let i = 0; i < player.length; ++i) {
      this.player.push(new Player({ initialMastery: this.totPlayer, name: player[i] }));
    }
    player.sort(randomsort);
    let PosS: Position[] = [];
    for (let i = 0; i < 3; i++) {
      let size: number = 2 * (this.player.length - 1) + (3 - i);
      //logger.verbose(size);
      for (let j = -size - 5; j <= size + 5; j++) {
        for (let k = -size - 5; k <= size + 5; k++) {
          this.board[[i, j, k].toString()] = {
            isBursted: !Player.inRange(this, [i, j, k])
          }
          if(i == 2 && !this.board[[i,j,k].toString()].isBursted) {
            PosS.push([i, j, k]);
          }
        }
      }
    }
    
    PosS.sort((a, b) => Math.random() - 0.5);
    for(let i = 0; i < this.player.length; i++) {
      this.player[i].position = PosS[i];
    }
    this.global = {
      round: 0,
      turn: 0,
      stage: 0,
      result: {},
    }
  }

  async gameMain() {
    await this.gameStart();
    while (this.totPlayer >= 1) { //记得改回来!!!!!(re)
      this.global.round++;
      for (let i = 0; i < this.player.length; i++) {
        this.global.turn = i;
        if (this.player[i].alive) {
          await this.turn(i);
          if (this.totPlayer < 2) {
            break;
          }
        }
        if (this.player[i].prayer > 0) {
          this.player[i].prayer--;
          i--;
        }
      }
    }
    if (this.totPlayer == 1) {
      for (let i = 0; i < this.player.length; i++) {
        if (this.player[i].alive) {
          this.global.result[this.player[i].name] = 1;
          break;
        }
      }
    }
    this.gameEnd();
  }

  async recastSignal(name: string): Promise<CardPara> {

    const res = await this.req({
      player: name,
      para: {
        type: 'recast'
      }
    });
    return res;
  }
  async cardSignal(name: string, inst: boolean): Promise<CardPara> {
    const res = await this.req({
      player: name,
      para: {
        type: 'card',
        stage: inst ? "instant" : "main",
      }
    });
    return res;
  }
  async actionSignal(name: string, pos: Position[]): Promise<CardPara> {
    const res = await this.req({
      player: name,
      para: {
        type: 'action',
        pos: pos
      }
    });
    return res;
  }
  async gameStart() {


    for (let i = 0; i < this.player.length; i++) {
      const res: CardPara = await this.recastSignal(this.player[i].name);
      if (res == null || res.type != 'recast') {
        continue;
      } else {

        this.player[i].recast(res.val);
      }
    }
  }
  async spyAction(id: number) {
    const legalMove1: Position[] = this.player[0].legalPos(this, '8', false, 1);
    const move1: CardPara = await this.actionSignal(this.player[id].name, legalMove1);
    this.player[0].playCard(this, '8', move1);
    const legalMove2: Position[] = this.player[0].legalPos(this, '8', false, 2);
    const move2: CardPara = await this.actionSignal(this.player[id].name, legalMove2);
    this.player[0].playCard(this, '8', move2);
    const legalMove3: Position[] = this.player[0].legalPos(this, '8', false, 3);
    const move3: CardPara = await this.actionSignal(this.player[id].name, legalMove3);
    this.player[0].playCard(this, '8', move3);
  }
  async action(id: number, inst: boolean) {
    let mov: Record<string, boolean> = {};
    let ist: Record<string, boolean> = {};
    ist['2'] = ist['5'] = ist['6'] = ist['7'] = ist['J'] = ist['BJ'] = ist['RJ'] = true;
    mov['AH'] = mov['AP'] = mov['AN'] = mov['2'] = mov['3'] = true;
    mov['10'] = mov['J'] = mov['0'] = mov['4'] = mov['9'] = true;
    let res: CardPara = await this.cardSignal(this.player[id].name, inst);
    logger.verbose(res);
    if (res != null && res.type == 'card') {
      if (!inst || (inst && ist[res.val])) {
        if(res.val == '8') {
          await this.spyAction(id);
          for(let i = 0; i < this.player[id].hand.length; i++) {
            if(this.player[id].hand[i] == '8') {
              this.player[id].hand.splice(i, 1);
            }
          }
        }
        else if (mov[res.val]) {
          const legalMove = this.player[id].legalPos(this, res.val, true);
          const move: CardPara = await this.actionSignal(this.player[id].name, legalMove);
          this.player[id].playCard(this, res.val, move);
        }
        else if (res.val == '5') {//recast
          const reca: CardPara = await this.recastSignal(this.player[id].name);
          this.player[id].playCard(this, res.val, reca);
        }
        else {
          const none: CardPara = {
            type: "none",
            val: null
          };
          this.player[id].playCard(this, res.val, none);
        }
      }
    }
  }
  async turn(id: number) {
    this.player[id].turnBegin();
    //instant turn
    await this.action(id, true);
    //main turn
    await this.action(id, false);
    //burst and drop
    this.player[id].passby.push(this.player[id].position);
    for (let i = 0; i < this.player.length; i++) {
      this.player[i].burst(this);
    }
    for (let i = 0; i < this.player.length; i++) {
      this.player[i].drop(this);
    }
    for (let i = 0; i < this.player.length; i++) {
      if (this.player[i].alive == false) {
        this.global.result[this.player[i].name] = this.totPlayer--;
      }
    }
  }
} 