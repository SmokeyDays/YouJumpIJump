export const enum GameStage {
  PREPARE,
  BATTLE,
  ACTION,
  END,
}

export const enum GameStep {
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

export const enum GameResult {
  AWIN,
  BWIN,
  DRAW,
}

export type Deck = {
  name: string,
  hrdayasutra: string,
  cardList: string[],
}