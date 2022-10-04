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
export type Board = Record<string, Slot>;
/*let a : Board = {};
let b: Slot = a[[1, 2, 3].toString()];*/
export type Card = string;

export type Position = [number, number, number];

// 服务端发送给客户端的格子集合
export type SlotList = Array<[number, number, number]>; // t, x, y