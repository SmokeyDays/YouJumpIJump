import { logger } from "../../lobby/tools/Logger";
import { Player, cardConfig } from "./player"
import { Board, GameStage, Position, ResponseParam, Card, RequestSignal, RequestParam, Slot } from "./regulates/interfaces"

class GameUIDManager {
  count = 0;
  get() {
    return ++this.count;
  }
}

export const GameUID = new GameUIDManager();

export function getInitMastery(n: number): number {
  if (n <= 4) {
    return 3;
  } else if (n <= 6) {
    return 4;
  } else {
    return 5;
  }
}

function randomsort(a: string, b: string): number {
  return Math.random() > .5 ? -1 : 1;
}

export class GameState {
  UID: number;
  board: Board = {};
  player: Player[] = [];
  global: {
    round: number,
    turn: number,
    stage: GameStage,
    result: Record<string, number> // 每名玩家的名次
  }
  totPlayer: number;
  req: (signal: RequestSignal) => Promise<ResponseParam>;
  gameEnd: () => void;

  constructor(player: string[], req: (signal: RequestSignal) => Promise<ResponseParam>, gameEnd: () => void) {
    this.gameEnd = gameEnd;
    this.req = req;
    this.UID = GameUID.get();
    this.totPlayer = player.length;
    for (let i = 0; i < player.length; ++i) {
      this.player.push(new Player({ initialMastery: getInitMastery(this.totPlayer), name: player[i] }));
    }
    player.sort(randomsort);
    let PosS: Position[] = [];
    for (let i = 0; i < 3; i++) {
      let size: number = 2 * (this.player.length - 1) + (3 - i);
      //logger.verbose(size);
      for (let j = -size - 8; j <= size + 8; j++) {
        for (let k = -size - 8; k <= size + 8; k++) {
          this.board[[i, j, k].toString()] = {
            isBursted: !Player.inRange(this, [i, j, k])
          }
          if (i == 2 && !this.board[[i, j, k].toString()].isBursted) {
            PosS.push([i, j, k]);
          }
        }
      }
    }

    PosS.sort((a, b) => Math.random() - 0.5);
    for (let i = 0; i < this.player.length; i++) {
      this.player[i].position = PosS[i];
    }
    this.global = {
      round: 0,
      turn: 0,
      stage: 0,
      result: {},
    }
  }

  // 返回指定位置的格子
  slotAt(position: Position): Slot {
    return this.board[position.toString()];
  }

  // 返回某一层的大小
  layerSize(layer: number): number {
    return 2 * (this.player.length - 1) + (3 - layer);
  }

  async gameMain() {
    await this.gameStart();
    while (this.totPlayer > 1) {
      this.global.round++;
      for (let i = 0; i < this.player.length; i++) {
        this.global.turn = i;
        if (this.player[i].alive) {
          await this.turn(i);
          if (this.totPlayer < 2) {
            break;
          }
        }
        if (this.player[i].prayer > 0) {
          this.player[i].prayer--;
          i--;
        }
      }
    }
    if (this.totPlayer == 1) {
      for (let i = 0; i < this.player.length; i++) {
        if (this.player[i].alive) {
          this.global.result[this.player[i].name] = 1;
          break;
        }
      }
    }
    logger.verbose("[Game %s] end with result %s", this.UID, this.global.result);
    this.gameEnd();
  }

  async recastSignal(name: string): Promise<ResponseParam> {
    const res = await this.req({
      player: name,
      para: {
        type: 'recast'
      }
    });
    return res;
  }

  async cardSignal(name: string, inst: boolean): Promise<ResponseParam> {
    const res = await this.req({
      player: name,
      para: {
        type: 'card',
        stage: inst ? "instant" : "main",
      }
    });
    return res;
  }

  async actionSignal(name: string, pos: Position[]): Promise<ResponseParam> {
    const res = await this.req({
      player: name,
      para: {
        type: 'action',
        pos: pos
      }
    });

    if (res.type === "move") {
      res.val[0] = parseInt(res.val[0].toString());
      res.val[1] = parseInt(res.val[1].toString());
      res.val[2] = parseInt(res.val[2].toString());
    }

    return res;
  }

  async gameStart() {
    for (let i = 0; i < this.player.length; i++) {
      this.global.turn = i;
      this.global.stage = GameStage.RECAST_ACTION;
      const res: ResponseParam = await this.recastSignal(this.player[i].name);
      if (res == null || res.type != 'recast') {
        continue;
      } else {
        this.player[i].recast(res.val);
      }
    }
  }

  async spyAction(id: number) {
    const legalMove1: Position[] = this.player[id].legalPos(this, '8', false, 1);
    const move1: ResponseParam = await this.actionSignal(this.player[id].name, legalMove1);
    this.player[id].playCard(this, '8', move1);

    const legalMove2: Position[] = this.player[id].legalPos(this, '8', false, 2);
    const move2: ResponseParam = await this.actionSignal(this.player[id].name, legalMove2);
    this.player[id].playCard(this, '8', move2);

    const legalMove3: Position[] = this.player[id].legalPos(this, '8', false, 3);
    const move3: ResponseParam = await this.actionSignal(this.player[id].name, legalMove3);
    this.player[id].playCard(this, '8', move3);
  }

  async action(id: number, inst: boolean) {
    let mov: Record<string, boolean> = {
      'AH': true, 'AP': true, 'AN': true, '2': true, '3': true,
      '10': true, 'J': true, '4': true, '9': true, 'Q': true,
    };
    let ist: Record<string, boolean> = {
      '2': true, '5': true, '6': true, '7': true, '9': true, 'J': true, 'BJ': true, 'RJ': true,
    };
    let res: ResponseParam = await this.cardSignal(this.player[id].name, inst);
    logger.verbose("[Game %s] Player %s cast operation %s with para %s as %s", this.UID, this.player[id].name, res.type, res.val, inst? "Instant": "Main");

    if (res != null && res.type == 'card') {
      if (!inst || (inst && ist[res.val])) {
        if (res.val == '8') {
          await this.spyAction(id);
          for (let i = 0; i < this.player[id].hand.length; i++) {
            if (this.player[id].hand[i] == '8') {
              this.player[id].hand.splice(i, 1);
              this.player[id].refillHand();
              break;
            }
          }
        }
        else if (mov[res.val]) {
          const legalMove = this.player[id].legalPos(this, res.val, inst);
          const move: ResponseParam = await this.actionSignal(this.player[id].name, legalMove);
          this.player[id].playCard(this, res.val, move);
        }
        else if (res.val == '5') {//recast
          for (let i = 0; i < this.player[id].hand.length; i++) {
            if (this.player[id].hand[i] == '5') {
              this.player[id].hand.splice(i, 1);
              break;
            }
          }
          const reca: ResponseParam = await this.recastSignal(this.player[id].name);
          this.player[id].playCard(this, res.val, reca);
        }
        else {
          const none: ResponseParam = {
            type: "none",
            val: null
          };
          this.player[id].playCard(this, res.val, none);
        }
      }
    }

    if (this.player[id].hand.length < this.player[id].mastery) {
      logger.error("[Game %s] Error: Player %s not draw card correctly!!!", this.UID, this.player[id].name);
      logger.error("[Game %s] More Info about the error, recent para: %s", this.UID, res);
    }
  }

  async turn(id: number) {

    this.player[id].turnBegin();

    this.global.stage = GameStage.INSTANT_ACTION;
    await this.action(id, true);

    this.global.stage = GameStage.MAIN_ACTION;
    await this.action(id, false);
    //burst and drop*
    this.player[id].passby.push(this.player[id].position);

    for (let i = 0; i < this.player.length; i++) {
      this.player[i].burst(this);
    }
    for (let i = 0; i < this.player.length; i++) {
      this.player[i].drop(this);
    }
    for (let i = 0; i < this.player.length; i++) {
      if (this.player[i].alive == false && this.global.result[this.player[i].name] === undefined) {
        this.global.result[this.player[i].name] = this.totPlayer--;
        logger.verbose("[Game %s] Player %s dead. Res: %s", this.UID, this.player[i].name, this.global.result);
      }
    }
  }
} 