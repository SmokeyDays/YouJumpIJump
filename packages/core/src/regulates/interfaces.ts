import { Player } from "../player";

export enum GameStage {
  INSTANT_ACTION,
  MAIN_ACTION,
}

/* ======== GameState ======== */
export class Slot {
  isBursted: boolean = true;
}
// Tiers from top to bottom are marked as 0, 1 and 2
export type Board = Array<Record<number, Record<number, Slot>>>;

export type Card = string;

export type Position = [number, number, number];

export interface GameState {
  board: Board,
  player: Player[],
  global: {
    round: number,
    turn: number,
    stage: GameStage, 
    result: Record<string, number> // 每名玩家的名次
  }
}


// 服务端发送给客户端的格子集合
export type SlotList = Array<[number, number, number]>; // t, x, y