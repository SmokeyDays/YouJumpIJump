/* ======== GameProcess And Signal ======== */

import internal from "stream";
import { Deck } from "./type";

/* ======== RoomState ======== */
export interface RoomState {
  roomName: string,
  users: string[],
}

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

export interface GameState {
  board: Board,
  playerState: PlayerState[],
  globalState: {
    round: number,
    turn: number,
    stage: GameStage, 
    result: Record<string, number> // 每名玩家的名次
  }
}

export interface PlayerState {
  position: [boolean, number, number, number], // 是否存活, 层数, x, y
  hand: Card[],
  mastery: number,
}

// 服务端发送给客户端的格子集合
export type SlotList = Array<[number, number, number]>; // t, x, y