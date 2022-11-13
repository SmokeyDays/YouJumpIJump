import { Context } from "cordis"
import { Card, Position, CardPara } from "./regulates/interfaces";
import { Deck } from "./regulates/type"
import { GameState } from "./game";
import { logger } from "../../lobby/tools/Logger";

// const enum Level {

// }
export const cardConfig = {
  cardNameList: ["AH", "AP", "AN", "2", "3", '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'BJ', 'RJ', '0'],
  // Alpha 1.0.0: cardTimesList: [1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 0]
  cardTimesList: [2, 2, 2, 4, 6, 3, 4, 3, 4, 4, 4, 2, 4, 4, 4, 1, 1, 0]

}

function rand(start: any, end: any) {
  return parseInt(Math.random() * (end - start + 1) + start);
}

export class Player {
  name: string;
  alive: boolean = true;           // 是否存活
  position: Position = [0, 0, 0];  // 层数, x, y
  hand: Card[] = [];               // 手牌
  library: Card[] = [];            // 牌堆
  magician: boolean = false;       // 巫师状态，免疫掉落
  mastery: number = 0;             // 智识
  passby: Position[] = [];         // 途径点
  toDestroy: Position[] = [];      // 将破裂的格子
  prayer: number = 0;              // 礼拜状态，进行额外回合
  laspos: Position = [0, 0, 0];

  constructor(config: Player.Config) {
    this.mastery = config.initialMastery;
    //this.mastery = 3;
    this.name = config.name;
    this.initLibrary();
    for (let i = 0; i < config.initialMastery; ++i) {
      this.drawCard();
    }
  }

  // 抽一张牌
  drawCard() {
    while (this.hand.length < this.mastery) {
      if (this.library.length <= 0) {
        this.initLibrary();
      }
      this.hand.push(this.library.pop()!);
      logger.verbose("Player %s draw card %s", this.name, this.hand[this.hand.length - 1]);
    }
  }

  // 初始化牌堆
  initLibrary() {
    this.library = [];
    for (let i = 0; i < cardConfig.cardNameList.length; ++i) {
      for (let j = 0; j < cardConfig.cardTimesList[i]; ++j) {
        this.library.push(cardConfig.cardNameList[i]);
      }
    }
    // const p = Math.random() * 3;
    // this.library.push(p > 2? "AH": p > 1? "AP": "AN");

    // 打乱牌堆
    for (let i = 1; i < this.library.length; i++) {
      let target = Math.floor(Math.random() * (i + 1));
      if (target !== i) {
        [this.library[target], this.library[i]] = [this.library[i], this.library[target]];
      }
    }
  }

  // 重铸卡牌
  recast(cardset: Card[]) {
    this.hand.sort();
    cardset.sort();
    let j: number = 0;
    for (let i = 0; i < this.hand.length; ++i) {
      if (cardset[j] == this.hand[i]) {
        j++;
        this.hand.splice(i, 1, this.library.pop() as string);
      }
    }
    logger.verbose(this.hand)
  }

  // 回合结束掉落判定
  drop(gamest: GameState) {
    if (this.magician) return;
    while (gamest.board[this.position.toString()].isBursted) {
      if (this.position[0] === 0) { // 掉下最后一层
        this.alive = false;
        return;
      } else { // 掉进下一层
        this.position[0]--;
      }
    }
  }

  // 回合开始初始化
  turnBegin() {
    this.laspos = this.position;
    this.magician = false;
  }

  // 判断指定点是否在场地内
  static inRange(gamest: GameState, pos: Position): boolean {
    let size: number = 2 * (gamest.player.length - 1) + (3 - pos[0]);
    //logger.verbose("inrange: %s, %s", pos, size);
    // if (pos[1] <= -size || pos[1] >= size) return false;
    // if (pos[2] <= -size || pos[2] >= size) return false;
    // if (pos[1] - pos[2] <= -size || pos[1] - pos[2] >= size) return false;
    return [pos[1], pos[2], pos[2] - pos[1]].every(delta => Math.abs(delta) < size);
  }

  /**
   * 计算某个卡牌的所有合法目标位置
   * @param gamest 游戏状态
   * @param cardid 卡牌 id
   * @param instant 是否为迅捷行动
   * @param spy ?
   * @returns 所有合法 Position
   */
  legalPos(gamest: GameState, cardid: string, instant: boolean, spy: number = 0): Position[] {
    let legalpos: Position[] = [];
    let pos: Position = this.position;
    let size: number = 2 * (gamest.player.length - 1) + (3 - this.position[0]);
    const len = size * 2 + 1;
    switch (cardid) {
      case cardConfig.cardNameList[0]: {
        for (let i = -1; i >= -len; i--) {
          let newpos: Position = [pos[0], pos[1] + i, pos[2]];
          if (!Player.inRange(gamest, newpos)) {
            break;
          }
          if (gamest.board[newpos.toString()].isBursted == true) {
            break;
          }
          if (legalpos.length == 1) {
            legalpos.pop();
          }
          legalpos.push(newpos);
        }
        let nowlen: number = legalpos.length;
        for (let i = 1; i <= len; i++) {
          let newpos: Position = [pos[0], pos[1] + i, pos[2]];
          if (!Player.inRange(gamest, newpos)) {
            break;
          }
          if (gamest.board[newpos.toString()].isBursted == true) {
            break;
          }
          if (legalpos.length == nowlen + 1) {
            legalpos.pop();
          }
          legalpos.push(newpos);
        }
        break;
      }
      case cardConfig.cardNameList[2]: {
        for (let i = -1; i >= -len; i--) {
          let newpos: Position = [pos[0], pos[1], pos[2] + i];
          if (!Player.inRange(gamest, newpos)) {
            break;
          }
          if (gamest.board[newpos.toString()].isBursted == true) {
            break;
          }
          if (legalpos.length == 1) {
            legalpos.pop();
          }
          legalpos.push(newpos);
        }
        let nowlen: number = legalpos.length;
        for (let i = 1; i <= len; i++) {
          let newpos: Position = [pos[0], pos[1], pos[2] + i];
          if (!Player.inRange(gamest, newpos)) {
            break;
          }
          if (gamest.board[newpos.toString()].isBursted == true) {
            break;
          }
          if (legalpos.length == nowlen + 1) {
            legalpos.pop();
          }
          legalpos.push(newpos);
        }
        break;
      }
      case cardConfig.cardNameList[1]: {
        let size: number = 2 * (gamest.player.length - 1) + (3 - this.position[0]);
        let pos: Position = this.position;
        for (let i = -1; i >= -len; i--) {
          let newpos: Position = [pos[0], pos[1] + i, pos[2] + i];
          if (!Player.inRange(gamest, newpos)) {
            break;
          }
          if (gamest.board[newpos.toString()].isBursted == true) {
            break;
          }
          if (legalpos.length == 1) {
            legalpos.pop();
          }
          legalpos.push(newpos);
        }
        let nowlen: number = legalpos.length;
        for (let i = 1; i <= len; i++) {
          let newpos: Position = [pos[0], pos[1] + i, pos[2] + i];
          if (!Player.inRange(gamest, newpos)) {
            break;
          }
          if (gamest.board[newpos.toString()].isBursted == true) {
            break;
          }
          if (legalpos.length == nowlen + 1) {
            legalpos.pop();
          }
          legalpos.push(newpos);
        }
        break;
      }
      case cardConfig.cardNameList[3]: {
        const dx = [0, 1, -1, 0, 0, 1, -1], dy = [0, 0, 0, 1, -1, 1, -1];
        for (let i = 1; i <= 6; i++) {
          let newpos: Position = [pos[0], pos[1] + dx[i], pos[2] + dy[i]];
          if (gamest.board[newpos.toString()].isBursted == false) {
            legalpos.push(newpos);
          }
        }
        if (!instant) {
          const laslen: number = legalpos.length;
          for (let i = 0; i < laslen; i++) {
            for (let j = 1; j <= 6; j++) {
              let newpos: Position = [pos[0], legalpos[i][1] + dx[j], legalpos[i][2] + dy[j]];
              // logger.verbose("newpos: %s", newpos);
              if (gamest.board[newpos.toString()].isBursted == false && !legalpos.includes(newpos)) {

                // logger.verbose("ava: %s", newpos);
                legalpos.push(newpos);
              }
            }
          }
        }
        break;
      }
      case cardConfig.cardNameList[4]: {
        let tot: number = 0;
        for (let i = 0; i < this.hand.length; i++) {
          if (this.hand[i] == "3") {
            tot++;
          }
        }
        if (tot == 3) {
          for (let i = 0; i < 3; i++) {
            let size = 2 * (gamest.player.length - 1) + (3 - i);
            for (let j = -size - 4; j <= size + 4; j++) {
              for (let k = -size - 4; k <= size + 4; k++) {
                if (gamest.board[[i, j, k].toString()].isBursted == false) {
                  legalpos.push([i, j, k]);
                }
              }
            }
          }
          break;
        }
        let cur: Position = [pos[0], pos[1] + tot, pos[2]];
        const dx = [0, -1, -1, 0, 1, 1], dy = [1, 0, -1, -1, 0, 1];
        for (let i = 0; i < 6; i++) {
          for (let j = 0; j < tot; j++) {
            if (Player.inRange(gamest, cur) && gamest.board[cur.toString()].isBursted == false) {
              legalpos.push([cur[0], cur[1], cur[2]]);
            }
            cur[1] += dx[i];
            cur[2] += dy[i];
          }
        }
        break;
      }
      case cardConfig.cardNameList[5]: {
        let cur: Position = [pos[0], pos[1] + 4, pos[2]];
        const dx = [0, -1, -1, 0, 1, 1], dy = [1, 0, -1, -1, 0, 1];
        for (let i = 0; i < 6; i++) {
          for (let j = 0; j < 4; j++) {
            if (Player.inRange(gamest, cur) && gamest.board[cur.toString()].isBursted == false) {
              legalpos.push([cur[0], cur[1], cur[2]]);
            }
            cur[1] += dx[i];
            cur[2] += dy[i];
          }
        }
        legalpos.push(pos);
        if (pos[0] <= 2) {
          legalpos.push([pos[0] + 1, pos[1], pos[2]]);
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
        if (spy == 1) {
          let newpos: Position = [pos[0], pos[1] + 1, pos[2]];
          if (gamest.board[newpos.toString()].isBursted == false) {
            legalpos.push(newpos);
          }
          newpos = [pos[0], pos[1] - 1, pos[2]];
          if (gamest.board[newpos.toString()].isBursted == false) {
            legalpos.push(newpos);
          }
          legalpos.push(pos);
        }
        if (spy == 2) {
          logger.verbose("pos: %s", pos);
          let newpos: Position = [pos[0], pos[1] + 1, pos[2] + 1];
          logger.verbose("newpos: %s", newpos);
          if (gamest.board[newpos.toString()].isBursted == false) {
            legalpos.push(newpos);
          }
          newpos = [pos[0], pos[1] - 1, pos[2] - 1];
          if (gamest.board[newpos.toString()].isBursted == false) {
            legalpos.push(newpos);
          }
          legalpos.push(pos);
        }
        if (spy == 3) {
          let newpos: Position = [pos[0], pos[1], pos[2] + 1];
          if (gamest.board[newpos.toString()].isBursted == false) {
            legalpos.push(newpos);
          }
          newpos = [pos[0], pos[1], pos[2] - 1];
          if (gamest.board[newpos.toString()].isBursted == false) {
            legalpos.push(newpos);
          }
          legalpos.push(pos);
        }
        if (spy == -1) {
          let newpos: Position = [pos[0], pos[1], pos[2]];
          for (let h = -1; h <= 1; ++h) {
            newpos = [pos[0], pos[1] + h, pos[2]];
            console.log(newpos);
            if (gamest.board[newpos.toString()].isBursted == false) {
              legalpos.push(newpos);
              for (let p = -1; p <= 1; ++p) {
                newpos = [pos[0], pos[1] + p + h, pos[2] + p];
                if (gamest.board[newpos.toString()].isBursted == false) {
                  legalpos.push(newpos);
                  for (let na = -1; na <= 1; ++na) {
                    newpos = [pos[0], pos[1] + p + h, pos[2] + p + na];
                    if (gamest.board[newpos.toString()].isBursted == false) {
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
        const dx = [0, 1, -1, 0, 0, 1, -1], dy = [0, 0, 0, 1, -1, 1, -1];
        for (let dir = 1; dir <= 6; ++dir) {
          for (let i = 1; i <= len; ++i) {
            let newpos: Position = [pos[0], pos[1] + dx[dir] * i, pos[2] + dy[dir] * i];
            if (!Player.inRange(gamest, newpos)) {
              break;
            }
            if (gamest.board[newpos.toString()].isBursted == true) {
              break;
            }
            legalpos.push(newpos);
          }
        }
        break;
      }
      case cardConfig.cardNameList[11]: {
        for (let i = 0; i < gamest.player.length; i++) {
          legalpos.push(gamest.player[i].position);
        }
        break;
      }
      case cardConfig.cardNameList[12]: {
        const dx = [0, 1, -1, 0, 0, 1, -1], dy = [0, 0, 0, 1, -1, 1, -1];
        for (let i = 1; i <= 6; i++) {
          let newpos: Position = [pos[0], pos[1] + dx[i], pos[2] + dy[i]];
          if (gamest.board[newpos.toString()].isBursted == false) {
            legalpos.push(newpos);
          }
        }
        break;
      }
      case cardConfig.cardNameList[13]: {
        let ply: Record<string, boolean> = {};
        for (let i = 0; i < gamest.player.length; i++) {
          ply[gamest.player[i].position.toString()] = true;
        }
        const dx = [0, 1, -1, 0, 0, 1, -1], dy = [0, 0, 0, 1, -1, 1, -1];
        for (let dir = 1; dir <= 6; ++dir) {
          for (let i = 1; i <= len; ++i) {
            let newpos: Position = [pos[0], pos[1] + dx[dir] * i, pos[2] + dy[dir] * i];
            if (!Player.inRange(gamest, newpos)) {
              break;
            }
            if (gamest.board[newpos.toString()].isBursted == true) {
              break;
            }
            if (ply[newpos.toString()] == true) {
              break;
            }
            legalpos.push(newpos);
          }
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
    return legalpos;
  }

  playCard(gamest: GameState, cardid: string, para: CardPara) {
    const pos = this.position;
    this.passby.push(pos);
    switch (cardid) {
      case cardConfig.cardNameList[0]: {
        if (para.type == 'move') {
          for (let i = Math.min(para.val[1], pos[1]); i <= Math.max(para.val[1], pos[1]); i++) {
            const cur: Position = [pos[0], i, pos[2]];
            this.passby.push(cur);
          }
          this.position = para.val;
        }
        break;
      }
      case cardConfig.cardNameList[2]: {
        if (para.type == 'move') {
          for (let i = Math.min(para.val[2], pos[2]); i <= Math.max(para.val[2], pos[2]); i++) {
            const cur: Position = [pos[0], pos[1], i];
            this.passby.push(cur);
          }
          this.position = para.val;
        }
        break;
      }
      case cardConfig.cardNameList[1]: {
        if (para.type == 'move') {
          const delta = Math.abs(para.val[1] - pos[1]);
          const mn1 = Math.min(para.val[1], pos[1]), mn2 = Math.min(para.val[2], pos[2]);
          for (let i = 0; i <= delta; i++) {
            const cur: Position = [pos[0], mn1 + i, mn2 + i];
            this.passby.push(cur);
          }
          this.position = para.val;
        }
        break;
      }
      case cardConfig.cardNameList[3]: {
        if (para.type == 'move') {
          this.passby.push(para.val);
          this.position = para.val;
        }
        break;
      }
      case cardConfig.cardNameList[4]: {
        if (para.type == 'move') {
          let tot: number = 0;
          for (let i = 0; i < this.hand.length; i++) {
            if (this.hand[i] == "3") {
              tot++;
            }
          }
          if (tot == 3) {
            this.mastery++;
          }
          this.position = para.val;
        }
        break;
      }
      case cardConfig.cardNameList[5]: {
        if(para.type == 'move') {
          this.toDestroy.push(pos);
          const dx = [0, 1, -1, 0, 0, 1, -1], dy = [0, 0, 0, 1, -1, 1, -1];
          for(let i = 0; i < dx.length; i++) {
            let cur:Position = [para.val[0], para.val[1] + dx[i], para.val[2] + dy[i]];
            this.toDestroy.push([cur[0], cur[1], cur[2]]);
          }
        }
        break;
      }

      case cardConfig.cardNameList[6]: {
        if (para.type == 'recast') {
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
        if (para.type == 'move') {
          this.passby.push(para.val);
          this.position = para.val;
        }
        break;
      }
      case cardConfig.cardNameList[10]: {
        if(para.type == 'move') {
          if(pos[1] != para.val[1] && pos[2] != para.val[2]) { //na
            const delta = Math.abs(para.val[1] - pos[1]);
            const mn1 = Math.min(para.val[1], pos[1]), mn2 = Math.min(para.val[2], pos[2]);
            for (let i = 0; i <= delta; i++) {
              const cur: Position = [pos[0], mn1 + i, mn2 + i];
              this.passby.push(cur);
            }
          }
          else if (pos[1] != para.val[1]) { //heng
            for (let i = Math.min(para.val[1], pos[1]); i <= Math.max(para.val[1], pos[1]); i++) {
              const cur: Position = [pos[0], i, pos[2]];
              this.passby.push(cur);
            }
          }
          else //pie
          {
            for (let i = Math.min(para.val[2], pos[2]); i <= Math.max(para.val[2], pos[2]); i++) {
              const cur: Position = [pos[0], pos[1], i];
              this.passby.push(cur);
            }
          }
          this.position = para.val;
          const dx = [0, 1, -1, 0, 0, 1, -1], dy = [0, 0, 0, 1, -1, 1, -1];
          this.toDestroy.push(pos);
          for(let i = 0; i < dx.length; i++) {
            let cur:Position = [para.val[0], para.val[1] + dx[i], para.val[2] + dy[i]];
            this.toDestroy.push([cur[0], cur[1], cur[2]]);
          }
          this.position = para.val;
        }
        break;
      }
      case cardConfig.cardNameList[11]: {
        if (para.type == 'move') {
          this.passby.push(para.val);
          this.position = para.val;
        }
        break;
      }
      case cardConfig.cardNameList[12]: {
        if (para.type == 'move') {
          this.passby.push(para.val);
        }
        break;
      }
      case cardConfig.cardNameList[13]: {
        if (para.type == 'move') {
          if (pos[1] != para.val[1] && pos[2] != para.val[2]) { //na
            const delta = Math.abs(para.val[1] - pos[1]);
            const mn1 = Math.min(para.val[1], pos[1]), mn2 = Math.min(para.val[2], pos[2]);
            for (let i = 0; i <= delta; i++) {
              const cur: Position = [pos[0], mn1 + i, mn2 + i];
              this.passby.push(cur);
            }
          }
          else if (pos[1] != para.val[1]) { //heng
            for (let i = Math.min(para.val[1], pos[1]); i <= Math.max(para.val[1], pos[1]); i++) {
              const cur: Position = [pos[0], i, pos[2]];
              this.passby.push(cur);
            }
          }
          else //pie
          {
            for (let i = Math.min(para.val[2], pos[2]); i <= Math.max(para.val[2], pos[2]); i++) {
              const cur: Position = [pos[0], pos[1], i];
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
        let exist: Position[] = [];
        for (let i = 0; i < 3; i++) {
          let size = 2 * (gamest.player.length - 1) + (3 - i);
          for (let j = -size - 4; j <= size + 4; j++) {
            for (let k = -size - 4; k <= size + 4; k++) {
              if (gamest.board[[i, j, k].toString()].isBursted == false) {
                exist.push([i, j, k]);
              }
            }
          }
        }
        exist.sort((a, b) => Math.random() - 0.5);
        this.position = exist[0];
        this.passby.push(exist[0]);
        this.hand.push('0');
        this.hand.push('0');
        break;
      }
      case cardConfig.cardNameList[16]: {
        for (let i = 0; i < this.mastery; i++) {
          this.hand.push('0');
        }
        let up: Position = [pos[0] + 1, pos[1], pos[2]];
        if (pos[0] < 2 && gamest.board[up.toString()].isBursted == false) {
          this.position = up;
          this.passby.push(up);
        }
        break;
      }
      case cardConfig.cardNameList[17]: {
        const dx = [0, 1, -1, 0, 0, 1, -1], dy = [0, 0, 0, 1, -1, 1, -1];
        let fpos: Position = [0, 0, 0];
        const size: number = 2 * (gamest.player.length - 1) + (3 - pos[0]);
        while (1) {
          let dr: number = rand(1, 6);
          fpos = [pos[0], pos[1] + dx[dr], pos[2] + dy[dr]];
          if (Player.inRange(gamest, [-2, fpos[1], fpos[2]])) {
            break;
          }
        }
        this.position = fpos;
        this.passby.push(fpos);
        break;
      }
    }
    if (cardid != '8' && cardid != '5') {
      for (let i = 0; i < this.hand.length; i++) {
        if (this.hand[i] == cardid) {
          this.hand.splice(i, 1);
          break;
        }
      }
    }
    this.drawCard();
  }
  
  burst(gamest: GameState) {
    const oldState = gamest.board[this.position.toString()].isBursted;
    for(const pos of this.passby) {
      gamest.board[pos.toString()].isBursted = true;
    }
    if (this.laspos.toString() !== this.position.toString()) {
      gamest.board[this.position.toString()].isBursted = oldState;
    }
    for(const pos of this.toDestroy) {
      gamest.board[pos.toString()].isBursted = true;
    }
    this.passby = this.toDestroy = [];
  }
}

export namespace Player {
  export interface Config {
    name: string,
    initialMastery: number
  }
}
