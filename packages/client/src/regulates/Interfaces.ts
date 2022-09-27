/* ======== GameProcess And Signal ======== */

import { Deck } from "./type";

export enum GameStage {
  PREPARE,
  BATTLE,
  ACTION,
  END,
}

export enum GameStep {
  GAME_START,
  UNTAP,
  TURN_START,
  PRACTICE,
  BATTLE_START,
  ATTACK,
  ACTION_START,
  FREE_ACTION,
  TURN_END,
  DISCARD,
  GAME_END,
}

export enum GameResult {
  AWIN,
  BWIN,
  DRAW,
}

/* ======== GameInfo ======== */

export interface CardState {
  name: string,
  counter: Record<string,number>,
  tapped: boolean,
  faceup: boolean,
  attribute: Record<string,number>,
  sectID: number,
  level: number,
  typeID: number,
  rarity: number,
  UID: number,
}

export interface PlayerState {
  basicState: {
    health: number,
    mana: number,
    level: number,
  },
  groundState: Record<string, CardState[]>,
}

/* ======== GameState ======== */

export interface GameState {
  playerState: PlayerState[],
  automatonState: {
    stage: GameStage,
    step: GameStep,
    /* 0: Alice, 1: Bob */
    priority: number,
    turn: number,
    round: number,
  }
}

/* ======== RoomState ======== */
export interface RoomState {
  roomName: string,
  users: (string | null)[],
  decks: Deck[],
}