import { Context } from "cordis"
import { Card, Position, CardPara } from "./regulates/interfaces";
import { Deck } from "./regulates/type"

// const enum Level {

// }
const cardConfig = {
  cardNameList: ["AH","AP","AN","2","3",'4','5','6','7','8','9','10','J','Q','K','BJ','RJ','0'],
  cardTimesList: [1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 0]
}

function rand(start: any,end: any){
	return parseInt(Math.random()*(end-start+1)+start);
}

export class Player {
  alive: boolean = true;
  position: Position = [0, 0, 0]; // 是否存活, 层数, x, y
  hand: Card[] = [];
  library: Card[] = [];
  magician: boolean = false;
  mastery: number;
  passby: Position[] = [];
  prayer: number = 0;
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
  playCard(ctx: Context, cardId: string, para: CardPara) {
    const pos = this.position;
    this.passby.push(pos);
    switch(cardId) {
      case cardConfig.cardNameList[0]: {
        if(para.type == 'move') {
          for(let i = Math.min(para.val[1], pos[1]); i <= Math.max(para.val[1], pos[1]); i++) {
            const cur:Position = [pos[0], i, pos[2]];
            this.passby.push(cur);
          }
          this.position = para.val;
        }
        break;
      }
      case cardConfig.cardNameList[1]: {
        if(para.type == 'move') {
          for(let i = Math.min(para.val[2], pos[2]); i <= Math.max(para.val[2], pos[2]); i++) {
            const cur:Position = [pos[0], pos[1], i];
            this.passby.push(cur);
          }
          this.position = para.val;
        }
        break;
      }
      case cardConfig.cardNameList[2]: {
        if(para.type == 'move') {
          const delta = Math.abs(para.val[1] - pos[1]);
          const mn1 = Math.min(para.val[1], pos[1]), mn2 = Math.min(para.val[1], pos[1]);
          for(let i = 0; i <= delta; i++) {
            const cur:Position = [pos[0], mn1 + delta, mn2 + delta];
            this.passby.push(cur);
          }
          this.position = para.val;
        }
        break;
      }
      case cardConfig.cardNameList[3]: {
        if(para.type == 'move') {
          this.passby.push(para.val);
          this.position = para.val;
        }
        break;
      }
      case cardConfig.cardNameList[4]: {
        if(para.type == 'move') {
          let tot = 0;
          for(let i = 0; i < this.hand.length; i++) {
            if(this.hand[i] == "3") {
              tot++;
            }
          }
          if(tot == 3) {
            this.mastery++;
          }
          this.position = para.val;
        }
        break;
      }
      case cardConfig.cardNameList[5]: {
        if(para.type == 'move') {
          this.passby.push(pos);
          const dx = [0, 1, -1, 0, 0, 1, -1], dy = [0, 0, 0, 0, -1, 1, -1];
          for(let i = 0; i < dx.length; i++) {
            let cur:Position = [para.val[0], para.val[1] + dx[i], para.val[2] + dy[i]];
            this.passby.push(cur);
          }
        }
        break;
      }

      case cardConfig.cardNameList[6]: {
        if(para.type == 'recast') {
          this.recast(para.val);
        }
        break;
      }
      case cardConfig.cardNameList[7]: {
        this.magician = true;
        this.hand.push('0');
        break;
      }
      case cardConfig.cardNameList[8]: {
        this.prayer++;
        break;
      }
      case cardConfig.cardNameList[9]: {
        if(para.type == 'spy') {
          for(let i = 0; i < 3; i++) {
            this.passby.push(para.val[i]);
          }
          this.position = para.val[2];
        }
        break;
      }
      case cardConfig.cardNameList[10]: {
        if(para.type == 'move') {
          if(pos[1] != para.val[1] && pos[2] != para.val[2]) { //na
            const delta = Math.abs(para.val[1] - pos[1]);
            const mn1 = Math.min(para.val[1], pos[1]), mn2 = Math.min(para.val[1], pos[1]);
            for(let i = 0; i <= delta; i++) {
              const cur:Position = [pos[0], mn1 + delta, mn2 + delta];
              this.passby.push(cur);
            }
          }
          else if(pos[1] != para.val[1]) { //heng
            for(let i = Math.min(para.val[1], pos[1]); i <= Math.max(para.val[1], pos[1]); i++) {
              const cur:Position = [pos[0], i, pos[2]];
              this.passby.push(cur);
            }
          }
          else //pie
          {
            for(let i = Math.min(para.val[2], pos[2]); i <= Math.max(para.val[2], pos[2]); i++) {
              const cur:Position = [pos[0], pos[1], i];
              this.passby.push(cur);
            }
          }
          this.position = para.val;
          const dx = [0, 1, -1, 0, 0, 1, -1], dy = [0, 0, 0, 0, -1, 1, -1];
          for(let i = 0; i < dx.length; i++) {
            let cur:Position = [para.val[0], para.val[1] + dx[i], para.val[2] + dy[i]];
            this.passby.push(cur);
          }
          this.position = para.val;
        }
        break;
      }
      case cardConfig.cardNameList[11]: {
        if(para.type == 'move') {
          this.passby.push(para.val);
          this.position = para.val;
        }
        break;
      }
      case cardConfig.cardNameList[12]: {
        if(para.type == 'move') {
          this.passby.push(para.val);
        }
        break;
      }
      case cardConfig.cardNameList[13]: {
        if(para.type == 'move') {
          if(pos[1] != para.val[1] && pos[2] != para.val[2]) { //na
            const delta = Math.abs(para.val[1] - pos[1]);
            const mn1 = Math.min(para.val[1], pos[1]), mn2 = Math.min(para.val[1], pos[1]);
            for(let i = 0; i <= delta; i++) {
              const cur:Position = [pos[0], mn1 + delta, mn2 + delta];
              this.passby.push(cur);
            }
          }
          else if(pos[1] != para.val[1]) { //heng
            for(let i = Math.min(para.val[1], pos[1]); i <= Math.max(para.val[1], pos[1]); i++) {
              const cur:Position = [pos[0], i, pos[2]];
              this.passby.push(cur);
            }
          }
          else //pie
          {
            for(let i = Math.min(para.val[2], pos[2]); i <= Math.max(para.val[2], pos[2]); i++) {
              const cur:Position = [pos[0], pos[1], i];
              this.passby.push(cur);
            }
          }
          this.position = para.val;
        }
        break;
      }
      case cardConfig.cardNameList[14]: {
        this.mastery++;
        this.hand.push('0');
        break;
      }
      case cardConfig.cardNameList[15]: {
        if(para.type == 'move') {
          let exist = [];
          for(let i = 0; i < 3; i++) {
            let size = 2 * (ctx.gameState.player.length - 1) + (3 - i);
            for(let j = -size + 1; j < size; j++) {
              for(let k = -size + 1; k < size; k++) {
                if(ctx.gameState.board[[i, j, k].toString()].isBursted == false) {
                  exist.push([i, j, k]);
                }
              }
            }
            let cur = rand(0,exist.length - 1);
            this.position = exist[cur] as Position;
            this.passby.push(exist[cur] as Position);
          }
        }
        break;
      }
      case cardConfig.cardNameList[16]: {
        for(let i = 0; i < this.mastery; i++) {
          this.hand.push('0');
        }
        let up:Position = [pos[0] + 1, pos[1], pos[2]];
        if(pos[0] != 2 && ctx.gameState.board[up.toString()].isBursted == false) {
          this.position = up;
          this.passby.push(up);
        }
        break;
      }
      case cardConfig.cardNameList[17]: {
        if(para.type == 'move') {
          const dx = [0, 1, -1, 0, 0, 1, -1], dy = [0, 0, 0, 0, -1, 1, -1];
          let dr = rand(0, 5);
          let fpos:Position = [pos[0], pos[1] + dx[dr], pos[2] + dx[dr]];
          this.position = fpos;
          this.passby.push(fpos);
        }
        break;
      }
    }
    this.drawCard();
  }
  Burst() {
    
  }
}

export namespace Player {
  export interface Config {
    initialMastery: number
  }
}
