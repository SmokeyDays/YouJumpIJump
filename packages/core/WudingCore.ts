import { Deck, GameStage } from './src/regulates/type'
import { Context } from "cordis"
import { duelInit, GameState } from './src';

interface WudingCoreInputSignal {

}

export interface WudingCoreOutputSignal {

}

export class WudingCore {
  app: Context;
  output: (signal: WudingCoreOutputSignal) => void;
  constructor(callback: (signal: WudingCoreOutputSignal) => void) {
    this.output = callback;
    this.app = new Context();
    this.app.plugin(duelInit);
    // bind message callback
    this.app.on('output-message', ((signal: WudingCoreOutputSignal) => {
      this.output(signal);
    }).bind(this));
  }
  startDuel(decks: Deck[]) {
    this.app.emit('duel-start', decks);
  }
  getGameState() {
    return this.app.duel;
  }
  input(signal: WudingCoreInputSignal): GameState {
    return this.getGameState();
  }
}