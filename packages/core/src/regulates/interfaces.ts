import { Player } from "../player";

export enum GameStage {
  INSTANT_ACTION,
  MAIN_ACTION,
  RECAST_ACTION,
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

// 客户端给服务器响应的参数
export type ResponseParam = {
  type: "move",
  val: Position
} | {
  type: "none",
  val: null
} | {
  type: "recast",
  val: Card[]
} | {
  type: "card",
  val: Card
}

// 服务器向客户端请求的参数
export type RequestParam = {
  type: 'recast',
} | {
  type: 'card',
  stage: "main" | "instant"
} | {
  type: 'action',
  pos: Position[]
}

export type RequestSignal = {
  player: string,
  para: RequestParam,
}