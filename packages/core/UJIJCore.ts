import { Context } from "cordis";
import { logger } from "../lobby/tools/Logger";
import { GameState } from "./src/game";
import { CardPara, GameStage, RequestSignal, SignalPara, SlotList } from "./src/regulates/interfaces";

declare module 'cordis' {
  export interface Context {
    gameState: GameState
  }
}

export class UJIJCore {
  
  app: Context;
  req: (signal: RequestSignal) => Promise<CardPara>;
  onGameEnd: () => void;
  // callback: (signal: UJIJ.OutputSignal) => void
  constructor(reqSignal: (signal: RequestSignal) => Promise<CardPara>, onGameEnd: () => void) {
    this.req = reqSignal;
    this.onGameEnd = onGameEnd;
    this.app = new Context();
    // this.app.plugin(duelInit);
    // bind message callback
    // this.app.on('output-message', (async (signal: RequestSignal) => {
    //   const ret = await this.req(signal);
    //   return ret;
    // }).bind(this));
  }
  startDuel(players: string[]) {
    this.app.gameState = new GameState(players, this.req, () => {
      this.onGameEnd();
    });
    this.app.gameState.gameMain();
  }
  getPosSet(player: string, card: string): SlotList {
    for(const pl of this.app.gameState.player) {
      if(pl.name === player) {
        return pl.legalPos(this.app.gameState, card, this.app.gameState.global.stage === GameStage.INSTANT_ACTION, -1);
      }
    }
    return [];
  }
  getGameState() {
    return this.app.gameState;
  }
}