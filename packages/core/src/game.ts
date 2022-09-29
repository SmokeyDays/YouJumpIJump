import { Context } from "cordis";
import { Player } from "./player"
import { Board, GameStage } from "./regulates/interfaces"

export class GameState {
  board: Board = [{}, {}, {}];
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
      this.player.push(new Player({initialMastery: this.totPlayer}));
    }
    this.global = {
      round: 0,
      turn: 0,
      stage: 0,
      result: {},
    }
  }
}