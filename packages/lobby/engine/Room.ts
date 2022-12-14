import { GameStage, GameState, IterateSignal, IterateSignalType, PlayerOperation, PlayerSignal } from "../regulates/interfaces";
import { logger } from "../tools/Logger";
import { User } from "./User";
import { UJIJCore } from "../../core/UJIJCore"
import { Card, ResponseParam, Position, RequestSignal } from "../../core/src/regulates/interfaces";
const defaultDeck1 = "swordAndFist";
const defaultDeck2 = "cardNotEnough";

const PLAYER_NO_ACTION: PlayerSignal = {
  type: PlayerOperation.NONE,
  state: null
};

export class Room {
  
  users: User[] = [];
  iterateSignal: IterateSignal | null = null;
  roomName: string;
  game: UJIJCore | null = null;

  roomSizeLimit: number = 8;

  constructor(name: string) {
    this.roomName = name;
  }

  async requester(val: RequestSignal) {
    const targetUser = this.getUser(val.player);
    const noneRes: ResponseParam = {
      type: "none",
      val: null
    };
    if(targetUser === null) {
      logger.error("Request player action Failed: player %s not found.", val.player);
      return noneRes;
    }
    if(val.para.type === "action" && val.para.pos.length === 0) {
      return noneRes;
    }
    await this.renew();
    await targetUser.emit("request-signal", val.para);
    const res = await new Promise<ResponseParam>((resolve, reject) => {
      let visited = false;
      targetUser.socket.once("resolve-signal", (para: ResponseParam) => {
        if(!visited) {
          visited = true;
          resolve(para);
        }
      })
      setTimeout(()=>{
        if(!visited) {
          visited = true;
          logger.error("Request player action Failed: %s action time out.", val.player);
          resolve(noneRes);
        }
      },60*1000)
    });
    return res;
  }

  gameEnd() {
    logger.verbose("game end with result:");
    logger.verbose("%s", this.game?.getGameState().global.result);
    for(let i = 0; i < this.users.length; ++i) {
      this.users[i]?.emit('game-end-signal', this.game?.getGameState());
    }
    this.game = null;
  }

  getPosSet(user: User, card: string): Position[] {
    if(this.game == null) {
      logger.error("Failed to get pos set in room %s: GAME HAS NOT STARTED", this.roomName);
      return [];
    }
    if(user.userName == null) {
      logger.error("Failed to get pos set in room %s: PLAYER %s NOT FOUND", this.roomName, user.userName);
      return [];
    }
    return this.game.getPosSet(user.userName, card.toString());
  }

  async startGame() {
    this.game = new UJIJCore(this.requester.bind(this), this.gameEnd.bind(this));
    logger.verbose('Room %s started a new game.', this.roomName);
    
    const userNameList: string[] = [];
    this.users.forEach((val) => {
      userNameList.push(val.userName !== null? val.userName: "????????????");
    });
    this.game.startDuel(userNameList);

    await this.renew();
  }

  addUser(user: User): boolean {
    if(this.users.length >= this.roomSizeLimit) {
      user.emit("alert-message", "?????????????????????????????????");
      logger.warn('User %s join room with name %s failed: room is full.', user.userName, this.roomName);
      return false;
    }
    if(this.hasUser(user)) {
      logger.error('User %s REJOINED THE ROOM %s.', user.userName, this.roomName);
      return false;
    }
    if(this.game !== null) {
      let inGame = false;
      for(let i = 0; i < this.game.getGameState().player.length; ++i) {
        inGame = inGame || (this.game.getGameState().player[i].name === user.userName);
      }
      if(!inGame) {
        user.emit("alert-message", "??????????????????????????????????????????");
        logger.warn('User %s join room with name %s failed: game has started.', user.userName, this.roomName);
        return false;
      }
    }
    this.users.push(user);
    this.renew();
    return true;
  }

  hasUser(user: User) {
    for(let i = 0; i < this.users.length; ++i) {
      if(this.users[i]?.userName == user.userName) {
        this.users[i] = user;
        return true;
      }
    }
    return false;
  }

  getUser(userName: string) {
    for(let i = 0; i < this.users.length; ++i) {
      if(this.users[i]?.userName == userName) {
        return this.users[i];
      }
    }
    return null;
  }

  removeUser(user: User) {
    for(let i = 0; i < this.users.length; ++i) {
      if(this.users[i]?.userName == user.userName) {
        logger.verbose('Remove user %s from room %s successfully.', user.userName, this.roomName);
        user.emit("alert-message", "??????????????????" + this.roomName);
        this.users.splice(i, 1);
        this.renew();
        return;
      }
    }
    logger.warn("Failed to remove user %s from room %s: NO SUCH USER", user.userName, this.roomName);
  }

  gameStateGenerator(id: number) {
    // Todo: hide those infomations that are invisible for opponent.
    if(this.game == null) {
      logger.error("Failed to get game state in room %s: GAME HAS NOT STARTED", this.roomName);
      return null;
    }
    // if(this.iterateSignal?.type != IterateSignalType.REQUEST) {
    //   logger.error("Failed to get iterate signal in room %s: GAME AUTOMATON NOT RUNNING", this.roomName);
    //   return null;
    // }
    // const nowSignal = this.iterateSignal.state[0] == id? this.iterateSignal.state[1]: PlayerOperation.NONE;
    const nowSignal = null;
    const gameState = this.game.getGameState();
    // console.log(this.game.app.gameState);
    let idx = -1;
    for(let plid = 0; plid < gameState.player.length; ++plid) {
      const pl = gameState.player[plid];
      logger.verbose(pl.hand)
      if(pl.name !== this.users[id].userName) {
        for(let i = 0; i < pl.hand.length; ++i) {
          // pl.hand[i] = "0";
        }
      } else {
        idx = plid;
      }
    }
    return {
      state: gameState,
      localPlayer: idx,
    };
  }

  async renew() {
    const roomState = {
      roomName: this.roomName,
      users: this.users.map(i => i?.userName),
    };
    if(this.game == null) {
      for(const i of this.users) {
        logger.verbose('Room %s renew to user %s', this, i?.userName);
        i?.emit('renew-room-state', roomState);
      }
    } else {
      for(let i = 0; i < this.users.length; ++i) {
        if(this.users[i].userName === null) {
          continue;
        }
        if(this?.game?.getGameState()?.global?.result[this.users[i].userName as string] !== undefined) {
          continue;
        }
        logger.verbose('Gamestate %s renew to user %s with id %s', 1, this.users[i]?.userName, i);
        await this.users[i]?.emit('renew-game-state', this.gameStateGenerator(i));
      }
    }
  }
}