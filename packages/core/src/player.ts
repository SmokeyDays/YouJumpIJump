import { Context } from "cordis"
import { Card, Position } from "./regulates/interfaces";
import { Deck } from "./regulates/type"

// const enum Level {

// }
const cardConfig = {
  cardNameList: ["AH","AP","AN","2","3",'4','5','6','7','8','9','10','J','Q','K','BJ','RJ','0'],
  cardTimesList: [1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 0]
}

export class Player {
  alive: boolean = true;
  position: Position = [0, 0, 0]; // 是否存活, 层数, x, y
  hand: Card[] = [];
  library: Card[] = [];
  mastery: number;
  constructor (config: Player.Config) {
    this.mastery = config.initialMastery;
    this.initLibrary();
    for(let i = 0; i < config.initialMastery; ++i) {
      this.drawCard();
    }
  }
  drawCard() {
    if(this.library.length <= 0) {
      this.initLibrary();
    }
    this.hand.push(this.library.pop() as string);
  }
  initLibrary() {
    this.library = [];
    for(let i = 0; i < cardConfig.cardNameList.length; ++i) {
      for(let j = 0; j < cardConfig.cardTimesList[i]; ++j) {
        this.library.push(cardConfig.cardNameList[i]);
      }
    }
    const p = Math.random() * 3;
    this.library.push(p > 2? "AH": p > 1? "AP": "AN");
    this.library.sort((a, b) => Math.random() - 0.5);
  }
}

export namespace Player {
  export interface Config {
    initialMastery: number
  }
}
