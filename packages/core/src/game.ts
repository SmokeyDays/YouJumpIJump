import { Context } from "cordis";
import { globalAgent } from "http";
import { string } from "schemastery";
import { Player, cardConfig } from "./player"
import { Board, GameStage, Position, CardPara, Card } from "./regulates/interfaces"

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
  constructor(player: string[]) {
    this.totPlayer = player.length;
    for(let i = 0; i < player.length; ++i) {
      this.player.push(new Player({initialMastery: this.totPlayer, name: player[i]}));
    }
    this.global = {
      round: 0,
      turn: 0,
      stage: 0,
      result: {},
    }
  }
  recastSignal(str: string): CardPara{
    const res: CardPara = {
      type: "none",
      val: null
    };
    return res;
  }
  cardSignal(str: string): CardPara{
    const res: CardPara = {
      type: "none",
      val: null
    };
    return res;
  }
  actionSignal(str: string, pos: Position[]): CardPara{
    const res: CardPara = {
      type: "none",
      val: null
    };
    return res;
  }
  async gamestart() {
    for(let i = 0; i < this.player.length; i++) {
      for(let j = 0; j < i; j++) {
        const res: CardPara = await this.recastSignal(this.player[i].name);
        if(res == null || res.type != 'recast') {
          continue;
        } else {
          this.player[i].recast(res.val);
        }
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
    const move3: CardPara = await this.actionSignal(this.player[id].name ,legalMove3);
    this.player[0].playCard(this, '8', move3);
  }
  async action(id: number, inst :boolean) {
    let mov: Record<string, boolean> = {};
    let ist: Record<string, boolean> = {};
    ist['2'] = ist['5'] = ist['6'] = ist['7'] = ist['J'] = ist['BJ'] = ist['RJ'] = true;
    mov['AH'] = mov['AP'] = mov['AN'] = mov['2'] = mov['3'] = true;
    mov['10'] = mov['J'] = mov['0'] = mov['4'] = mov['9'] = true;
    let res: CardPara = await this.cardSignal(this.player[id].name);
    if(res != null && res.type == 'card') {
      if(!inst || (inst && ist[res.val])) {
        if(mov[res.val]) {
          const legalMove = this.player[id].legalPos(this, res.val, true);
          const move: CardPara = await this.actionSignal(this.player[id].name, legalMove);
          this.player[id].playCard(this, res.val, move);
        }
        else if(res.val == '5') {//recast
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
    this.action(id, true);
    //main turn
    this.action(id, false);
    //burst and drop
    for(let i = 0; i < this.player.length; i++) {
      this.player[i].burst(this);
    }
    for(let i = 0; i < this.player.length; i++) {
      this.player[i].drop(this);
    }
    for(let i = 0; i < this.player.length; i++) {
      if(this.player[i].alive == false) {
        this.global.result[this.player[i].name] = this.totPlayer--;
      }
    }
  }
  
} 