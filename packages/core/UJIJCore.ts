import { Context } from "cordis";
import { GameState } from "./src/game";
import { CardPara, RequestSignal, SignalPara } from "./src/regulates/interfaces";

declare module 'cordis' {
  export interface Context {
    gameState: GameState
  }
  export interface Events {
    // duel event
    'duel-start': () => void
    'duel-end': () => void

    // turn event
    'stage-prepare': (id: number) => void
    'stage-battle': () => void
    'stage-action': () => void
    'stage-end': () => void

    // player event
    'player-cast': () => void
    'player-draw': (id: number) => void
    'player-grow': (id: number) => void
    'player-discard': (id: number) => void
    'player-attack': (id: number) => void
    'player-damage': (id: number) => void
    'player-shuffle': (id: number) => void

    // card event
    'card-place': () => void
    'card-effect': () => void
    'card-resolve': () => void
    'card-untap': () => void

    // socket event
    'output-message': (signal: RequestSignal) => Promise<CardPara>
  }
}

export class UJIJCore {
  
  app: Context;
  req: (signal: RequestSignal) => Promise<CardPara>;
  // callback: (signal: UJIJ.OutputSignal) => void
  constructor(callback: (signal: RequestSignal) => Promise<CardPara>) {
    this.req = callback;
    this.app = new Context();
    // this.app.plugin(duelInit);
    // bind message callback
    this.app.on('output-message', (async (signal: RequestSignal) => {
      const ret = await this.req(signal);
      return ret;
    }).bind(this));
    this.startDuel();
  }
  startDuel() {
    this.app.gameState = new GameState(["Alice", "Bob", "Cat"], this.req);
  }
  getGameState() {
    return this.app.gameState;
  }
}