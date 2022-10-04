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
  magician: boolean = false;
  mastery: number;
  constructor (config: Player.Config) {
    this.mastery = config.initialMastery;
    this.initLibrary();
    for(let i = 0; i < config.initialMastery; ++i) {
      this.drawCard();
    }
  }
  drawCard() {
    while(this.hand.length < this.mastery) {
      if(this.library.length <= 0) {
        this.initLibrary();
      }
      this.hand.push(this.library.pop() as string);
    }
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
  recast(cardset: Card[]) {
    this.hand.sort();
    cardset.sort();
    let j = 0;
    for(let i = 0; i < this.hand.length; ++i) {
      if(cardset[j] == this.hand[i]) {
        j++;
        this.hand.splice(i, 1, this.library.pop() as string);
      }
    }
  }
  drop(ctx: Context) {
    if(this.magician) return;
    /*while(ctx.gameState.board[this.position[0].toString() + ' ' + this.position[1].toString() + 
    ' ' + this.position[2].toString()].isBursted == true && this.position[0]) */
    while(ctx.gameState.board[this.position.toString()].isBursted == true && this.position[0]) {
      this.position[0]--;
    }
    if(!this.position[0]) {
      this.alive = false;
      return;
    }
  }
  playCard(ctx: Context, cardId: string, newpos?: Position) {
    ctx.gameState.board[this.position.toString()].isBursted = true;
    const pos = this.position;
    switch(cardId) {
      case cardConfig.cardNameList[0]: {
        for(let i = Math.min(newpos[1], pos[1]); i <= Math.max(newpos[1], pos[1]); i++) {
          const cur = [pos[0], i, pos[2]];
          ctx.gameState.board[cur.toString()].isBursted = true;
        }
        break;
      }
      case cardConfig.cardNameList[1]: {
        for(let i = Math.min(newpos[2], pos[2]); i <= Math.max(newpos[2], pos[2]); i++) {
          const cur = [pos[0], pos[1], i];
          ctx.gameState.board[cur.toString()].isBursted = true;
        }
        break;
      }
      case cardConfig.cardNameList[2]: {
        const delta = Math.abs(newpos[1] - pos[1]);
        const mn1 = Math.min(newpos[1], pos[1]), mn2 = Math.min(newpos[1], pos[1]);
        for(let i = 0; i <= delta; i++) {
          const cur = [pos[0], mn1 + delta, mn2 + delta];
          ctx.gameState.board[cur.toString()].isBursted = true;
        }
        break;
      }
      case cardConfig.cardNameList[3]: {
        ctx.gameState.board[newpos.toString()].isBursted = true;
        break;
      }
      case cardConfig.cardNameList[4]: {
        ctx.gameState.board[newpos.toString()].isBursted = true;
        let tot = 0;
        for(let i = 0; i < this.hand.length; i++) {
          if(this.hand[i] == "3") {
            tot++;
          }
        }
        if(tot == 3) {
          this.mastery++;
        }
        break;
      }
      case cardConfig.cardNameList[5]: {
        ctx.gameState.board[pos.toString()].isBursted = true;
        const dx = [0, 1, -1, 0, 0, 1, -1], dy = [0, 0, 0, 0, -1, 1, -1];
        for(let i = 0; i < dx.length; i++) {
          let cur = [newpos[0], newpos[1] + dx[i], newpos[2] + dy[i]];
          ctx.gameState.board[cur.toString()].isBursted = true;
        }
        break;
      }
      case cardConfig.cardNameList[6]: {
        
        break;
      }
      case cardConfig.cardNameList[7]: {
        break;
      }
      case cardConfig.cardNameList[8]: {
        break;
      }
      case cardConfig.cardNameList[9]: {
        break;
      }
      case cardConfig.cardNameList[10]: {
        break;
      }
      case cardConfig.cardNameList[11]: {
        break;
      }
      case cardConfig.cardNameList[12]: {
        break;
      }
      case cardConfig.cardNameList[13]: {
        break;
      }
      case cardConfig.cardNameList[14]: {
        break;
      }
      case cardConfig.cardNameList[15]: {
        break;
      }
      case cardConfig.cardNameList[16]: {
        break;
      }
      case cardConfig.cardNameList[17]: {
        break;
      }
    }
    this.drawCard();
  }

}

export namespace Player {
  export interface Config {
    initialMastery: number
  }
}
