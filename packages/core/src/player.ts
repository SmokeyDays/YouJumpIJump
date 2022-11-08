import { Context } from "cordis"
import { Card, Position, CardPara } from "./regulates/interfaces";
import { Deck } from "./regulates/type"
import { GameState } from "./game";
import { logger } from "../../lobby/tools/Logger";

// const enum Level {

// }
export const cardConfig = {
  cardNameList: ["AH","AP","AN","2","3",'4','5','6','7','8','9','10','J','Q','K','BJ','RJ','0'],
  cardTimesList: [1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 0]
}

function rand(start: any,end: any){
	return parseInt(Math.random()*(end-start+1)+start);
}

export class Player {
  name: string;
  alive: boolean = true;
  position: Position = [0, 0, 0]; // 是否存活, 层数, x, y
  hand: Card[] = [];
  library: Card[] = [];
  magician: boolean = false;
  mastery: number = 0;
  passby: Position[] = [];
  prayer: number = 0;
  laspos: Position = [0, 0, 0];
  constructor (config: Player.Config) {
    this.mastery = config.initialMastery;
    this.name = config.name;
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
    let j:number = 0;
    for(let i = 0; i < this.hand.length; ++i) {
      if(cardset[j] == this.hand[i]) {
        j++;
        this.hand.splice(i, 1, this.library.pop() as string);
      }
    }
    logger.verbose("&&&&")
    logger.verbose(this.hand)
  }

  drop(gamest: GameState) {
    if(this.magician) return;
    /*while(gamest.board[this.position[0].toString() + ' ' + this.position[1].toString() + 
    ' ' + this.position[2].toString()].isBursted == true && this.position[0]) */
    while(gamest.board[this.position.toString()].isBursted == true && this.position[0]) {
      this.position[0]--;
    }
    if(!this.position[0]) {
      this.alive = false;
      return;
    }
  }

  turnBegin() {
    this.laspos = this.position;
  }
  static inRange(gamest: GameState, pos: Position):boolean {
    let size:number = 2 * (gamest.player.length - 1) - (3 - pos[0]);
    if(pos[1] <= -size || pos[1] >= size) return false;
    if(pos[2] <= -size || pos[2] >= size) return false;
    if(Math.abs(pos[1] - pos[2]) > size) return false;
    return true;
  }
  legalPos(gamest: GameState, cardid: string, instant: boolean, spy: number = 0):Position[] {
    let legalpos: Position[] = [];
    let pos: Position = this.position;
    let size: number = 2 * (gamest.player.length - 1) + (3 - this.position[0]);
    
    logger.verbose("cardid: %s", cardid);
    switch(cardid) {
      case cardConfig.cardNameList[0]: {
        for(let i = -1; i >= -size; i--) {
          let newpos: Position = [pos[0], pos[1] + i, pos[2]];
          if(!Player.inRange(gamest, newpos)) {
            break;
          }
          if(gamest.board[newpos.toString()].isBursted == true) {
            break;
          }
          if(legalpos.length == 1) {
            legalpos.pop();
          }
          legalpos.push(newpos);
        }
        let nowlen: number = legalpos.length;
        for(let i = 1; i <= size; i++) {
          let newpos: Position = [pos[0], pos[1] + i, pos[2]];
          if(!Player.inRange(gamest, newpos)) {
            break;
          }
          if(gamest.board[newpos.toString()].isBursted == true) {
            break;
          }
          if(legalpos.length == nowlen + 1) {
            legalpos.pop();
          }
          legalpos.push(newpos);
        }
        break;
      }
      case cardConfig.cardNameList[1]: {
        for(let i = -1; i >= -size; i--) {
          let newpos: Position = [pos[0], pos[1], pos[2] + i];
          if(!Player.inRange(gamest, newpos)) {
            break;
          }
          if(gamest.board[newpos.toString()].isBursted == true) {
            break;
          }
          if(legalpos.length == 1) {
            legalpos.pop();
          }
          legalpos.push(newpos);
        }
        let nowlen: number = legalpos.length;
        for(let i = 1; i <= size; i++) {
          let newpos: Position = [pos[0], pos[1], pos[2] + i];
          if(!Player.inRange(gamest, newpos)) {
            break;
          }
          if(gamest.board[newpos.toString()].isBursted == true) {
            break;
          }
          if(legalpos.length == nowlen + 1) {
            legalpos.pop();
          }
          legalpos.push(newpos);
        }
        break;
      }
      case cardConfig.cardNameList[2]: {
        let size: number = 2 * (gamest.player.length - 1) + (3 - this.position[0]);
        let pos: Position = this.position;
        for(let i = -1; i >= -size; i--) {
          let newpos: Position = [pos[0], pos[1] + i, pos[2] + i];
          if(!Player.inRange(gamest, newpos)) {
            break;
          }
          if(gamest.board[newpos.toString()].isBursted == true) {
            break;
          }
          if(legalpos.length == 1) {
            legalpos.pop();
          }
          legalpos.push(newpos);
        }
        let nowlen: number = legalpos.length;
        for(let i = 1; i <= size; i++) {
          let newpos: Position = [pos[0], pos[1] + i, pos[2] + i];
          if(!Player.inRange(gamest, newpos)) {
            break;
          }
          if(gamest.board[newpos.toString()].isBursted == true) {
            break;
          }
          if(legalpos.length == nowlen + 1) {
            legalpos.pop();
          }
          legalpos.push(newpos);
        }
        break;
      }
      case cardConfig.cardNameList[3]: {
        const dx = [0, 1, -1, 0, 0, 1, -1], dy = [0, 0, 0, 0, -1, 1, -1];
        for(let i = 1; i <= 6; i++) {
          let newpos:Position = [pos[0], pos[1] + dx[i], pos[2] + dx[i]];
          if(gamest.board[newpos.toString()].isBursted == false) {
            legalpos.push(newpos);
          }
        }
        if(!instant) {
          for(let i = 0; i < legalpos.length; i++) {
            for(let j = 1; j <= 6; j++) {
              let newpos:Position = [pos[0], legalpos[i][1] + dx[i], legalpos[i][2] + dx[i]];
              if(gamest.board[newpos.toString()].isBursted == false && !legalpos.includes(newpos)) {
                legalpos.push(newpos);
              }
            }
          }
        }
        break;
      }
      case cardConfig.cardNameList[4]: {
        let tot: number = 0;
        for(let i = 0; i < this.hand.length; i++) {
          if(this.hand[i] == "3") {
            tot++;
          }
        }
        let cur: Position = [pos[0], pos[1] + tot, pos[2]];
        const dx = [-1, -1, 0, 1, 1, 0], dy = [-1, 0, -1, 1, 0, 1];
        for(let i = 0; i < 6; i++) {
          for(let j = 0; j < tot; j++) {
            if(!Player.inRange(gamest, cur)) {
              continue;
            }
            if(gamest.board[cur.toString()].isBursted == false) {
              legalpos.push(cur);
            }
            cur[1] += dx[i];
            cur[2] += dy[i];
          }
        }
        break;
      }
      case cardConfig.cardNameList[5]: {
        let cur: Position = [pos[0], pos[1] + 4, pos[2]];
        const dx = [-1, -1, 0, 1, 1, 0], dy = [-1, 0, -1, 1, 0, 1];
        for(let i = 0; i < 6; i++) {
          for(let j = 0; j < 4; j++) {
            if(!Player.inRange(gamest, cur)) {
              continue;
            }
            if(gamest.board[cur.toString()].isBursted == false) {
              legalpos.push(cur);
            }
            cur[1] += dx[i];
            cur[2] += dy[i];
          }
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
        if(spy == 1) {
          let newpos: Position = [pos[0], pos[1] + 1, pos[2]];
          if(gamest.board[newpos.toString()].isBursted == false) {
            legalpos.push(newpos);
          }
          newpos = [pos[0], pos[1] - 1, pos[2]];
          if(gamest.board[newpos.toString()].isBursted == false) {
            legalpos.push(newpos);
          }
          legalpos.push(pos);
        }
        if(spy == 2) {
          let newpos: Position = [pos[0], pos[1] + 1, pos[2] + 1];
          if(gamest.board[newpos.toString()].isBursted == false) {
            legalpos.push(newpos);
          }
          newpos = [pos[0], pos[1] - 1, pos[2] - 1];
          if(gamest.board[newpos.toString()].isBursted == false) {
            legalpos.push(newpos);
          }
          legalpos.push(pos);
        }
        if(spy == 3) {
          let newpos: Position = [pos[0], pos[1], pos[2] + 1];
          if(gamest.board[newpos.toString()].isBursted == false) {
            legalpos.push(newpos);
          }
          newpos = [pos[0], pos[1], pos[2] - 1];
          if(gamest.board[newpos.toString()].isBursted == false) {
            legalpos.push(newpos);
          }
          legalpos.push(pos);
        }
        if(spy == -1) {
          let newpos: Position = [pos[0], pos[1] , pos[2]];
          for(let h = -1; h <= 1; ++h) {
            newpos = [pos[0], pos[1] + h, pos[2]];
            console.log(newpos);
            if(gamest.board[newpos.toString()].isBursted == false) {
              legalpos.push(newpos);
              for(let p = -1; p <= 1; ++p) {
                newpos = [pos[0], pos[1] + p + h, pos[2] + p];
                if(gamest.board[newpos.toString()].isBursted == false) {
                  legalpos.push(newpos);
                  for(let na = -1; na <= 1; ++na) {
                    newpos = [pos[0], pos[1] + p + h, pos[2] + p + na];
                    if(gamest.board[newpos.toString()].isBursted == false) {
                      legalpos.push(newpos);
                    }
                  }
                }
              }
            }
          }
        }
        break;
      }
      case cardConfig.cardNameList[10]: {
        for(let i = -1; i >= -size; i--) {
          let newpos: Position = [pos[0], pos[1] + i, pos[2]];
          if(!Player.inRange(gamest, newpos)) {
            break;
          }
          if(gamest.board[newpos.toString()].isBursted == true) {
            break;
          }
          legalpos.push(newpos);
        }
        for(let i = 1; i <= size; i++) {
          let newpos: Position = [pos[0], pos[1] + i, pos[2]];
          if(!Player.inRange(gamest, newpos)) {
            break;
          }
          if(gamest.board[newpos.toString()].isBursted == true) {
            break;
          }
          legalpos.push(newpos);
        }
        for(let i = -1; i >= -size; i--) {
          let newpos: Position = [pos[0], pos[1] + i, pos[2]];
          if(!Player.inRange(gamest, newpos)) {
            break;
          }
          if(gamest.board[newpos.toString()].isBursted == true) {
            break;
          }
          legalpos.push(newpos);
        }
        for(let i = 1; i <= size; i++) {
          let newpos: Position = [pos[0], pos[1], pos[2] + i];
          if(!Player.inRange(gamest, newpos)) {
            break;
          }
          if(gamest.board[newpos.toString()].isBursted == true) {
            break;
          }
          legalpos.push(newpos);
        }
        for(let i = -1; i >= -size; i--) {
          let newpos: Position = [pos[0], pos[1], pos[2] + i];
          if(!Player.inRange(gamest, newpos)) {
            break;
          }
          if(gamest.board[newpos.toString()].isBursted == true) {
            break;
          }
          legalpos.push(newpos);
        }
        for(let i = 1; i <= size; i++) {
          let newpos: Position = [pos[0], pos[1] + i, pos[2] + i];
          if(!Player.inRange(gamest, newpos)) {
            break;
          }
          if(gamest.board[newpos.toString()].isBursted == true) {
            break;
          }
          legalpos.push(newpos);
        }
        for(let i = 1; i <= size; i++) {
          let newpos: Position = [pos[0], pos[1] + i, pos[2] + i];
          if(!Player.inRange(gamest, newpos)) {
            break;
          }
          if(gamest.board[newpos.toString()].isBursted == true) {
            break;
          }
          legalpos.push(newpos);
        }
        break;
      }
      case cardConfig.cardNameList[11]: {
        for(let i = 0; i < gamest.player.length; i++) {
          legalpos.push(gamest.player[i].position);
        }
        break;
      }
      case cardConfig.cardNameList[12]: {
        const dx = [0, 1, -1, 0, 0, 1, -1], dy = [0, 0, 0, 0, -1, 1, -1];
        for(let i = 1; i <= 6; i++) {
          let newpos:Position = [pos[0], pos[1] + dx[i], pos[2] + dx[i]];
          if(gamest.board[newpos.toString()].isBursted == false) {
            legalpos.push(newpos);
          }
        }
        break;
      }
      case cardConfig.cardNameList[13]: {
        let ply: Record<string, boolean> = {};
        for(let i = 0; i < gamest.player.length; i++) {
          ply[gamest.player[i].position.toString()] = true;
        }
        for(let i = -1; i >= -size; i--) {
          let newpos: Position = [pos[0], pos[1] + i, pos[2]];
          if(!Player.inRange(gamest, newpos)) {
            break;
          }
          if(gamest.board[newpos.toString()].isBursted == true) {
            break;
          }
          if(ply[newpos.toString()] == true) {
            break;
          }
          legalpos.push(newpos);
        }
        for(let i = 1; i <= size; i++) {
          let newpos: Position = [pos[0], pos[1] + i, pos[2]];
          if(!Player.inRange(gamest, newpos)) {
            break;
          }
          if(gamest.board[newpos.toString()].isBursted == true) {
            break;
          }
          if(ply[newpos.toString()] == true) {
            break;
          }
          legalpos.push(newpos);
        }
        for(let i = -1; i >= -size; i--) {
          let newpos: Position = [pos[0], pos[1], pos[2] + i];
          if(!Player.inRange(gamest, newpos)) {
            break;
          }
          if(gamest.board[newpos.toString()].isBursted == true) {
            break;
          }
          if(ply[newpos.toString()] == true) {
            break;
          }
          legalpos.push(newpos);
        }
        for(let i = 1; i <= size; i++) {
          let newpos: Position = [pos[0], pos[1], pos[2] + i];
          if(!Player.inRange(gamest, newpos)) {
            break;
          }
          if(gamest.board[newpos.toString()].isBursted == true) {
            break;
          }
          if(ply[newpos.toString()] == true) {
            break;
          }
          legalpos.push(newpos);
        }
        for(let i = -1; i >= -size; i--) {
          let newpos: Position = [pos[0], pos[1], pos[2] + i];
          if(!Player.inRange(gamest, newpos)) {
            break;
          }
          if(gamest.board[newpos.toString()].isBursted == true) {
            break;
          }
          if(ply[newpos.toString()] == true) {
            break;
          }
          legalpos.push(newpos);
        }
        for(let i = 1; i <= size; i++) {
          let newpos: Position = [pos[0], pos[1] + i, pos[2] + i];
          if(!Player.inRange(gamest, newpos)) {
            break;
          }
          if(gamest.board[newpos.toString()].isBursted == true) {
            break;
          }
          if(ply[newpos.toString()] == true) {
            break;
          }
          legalpos.push(newpos);
        }
        for(let i = 1; i <= size; i++) {
          let newpos: Position = [pos[0], pos[1] + i, pos[2] + i];
          if(!Player.inRange(gamest, newpos)) {
            break;
          }
          if(gamest.board[newpos.toString()].isBursted == true) {
            break;
          }
          if(ply[newpos.toString()] == true) {
            break;
          }
          legalpos.push(newpos);
        }
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
    logger.verbose("%s:%s",cardid , legalpos)
    return legalpos;
  }

  playCard(gamest: GameState, cardid: string, para: CardPara) {
    const pos = this.position;
    this.passby.push(pos);
    switch(cardid) {
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
          let tot: number = 0;
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
        if(para.type == 'move') {
          this.passby.push(para.val);
          this.position = para.val;
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
          let exist:Position[] = [];
          for(let i = 0; i < 3; i++) {
            let size = 2 * (gamest.player.length - 1) + (3 - i);
            for(let j = -size + 1; j < size; j++) {
              for(let k = -size + 1; k < size; k++) {
                if(gamest.board[[i, j, k].toString()].isBursted == false) {
                  exist.push([i, j, k]);
                }
              }
            }
            let cur = rand(0,exist.length - 1);
            this.position = exist[cur];
            this.passby.push(exist[cur]);
          }
        }
        break;
      }
      case cardConfig.cardNameList[16]: {
        for(let i = 0; i < this.mastery; i++) {
          this.hand.push('0');
        }
        let up:Position = [pos[0] + 1, pos[1], pos[2]];
        if(pos[0] != 2 && gamest.board[up.toString()].isBursted == false) {
          this.position = up;
          this.passby.push(up);
        }
        break;
      }
      case cardConfig.cardNameList[17]: {
        if(para.type == 'move') {
          const dx = [0, 1, -1, 0, 0, 1, -1], dy = [0, 0, 0, 0, -1, 1, -1];
          let dr:number = rand(1, 6);
          let fpos:Position = [pos[0], pos[1] + dx[dr], pos[2] + dx[dr]];
          this.position = fpos;
          this.passby.push(fpos);
        }
        break;
      }
    }
    for(let i = 0; i < this.hand.length; i++) {
      if(this.hand[i] == cardid) {
        this.hand.splice(i, 1);
      }
    }
    this.drawCard();
  }
  burst(gamest: GameState) {
    for(let i = 0; i < this.passby.length; i++) {
      gamest.board[this.passby[i].toString()].isBursted = true;
    }
    if(this.laspos != this.position) {
      gamest.board[this.position.toString()].isBursted = false;
    }
    this.passby = [];
  }
}

export namespace Player {
  export interface Config {
    name: string,
    initialMastery: number
  }
}
