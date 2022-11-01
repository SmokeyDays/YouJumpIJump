import { GameStage, GameState, IterateSignal, IterateSignalType, PlayerOperation, PlayerSignal } from "../regulates/interfaces";
import { logger } from "../tools/Logger";
import { User } from "./User";
import { UJIJCore } from "../../core/UJIJCore"
import { Card, CardPara, RequestSignal } from "../../core/src/regulates/interfaces";
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
    const noneRes: CardPara = {
      type: "none",
      val: null
    };
    if(targetUser === null) {
      logger.error("Request player action Failed: player %s not found.", val.player);
      return noneRes;
    }
    await targetUser.emit("request-signal", val.para);
    const res = await new Promise<CardPara>((resolve, reject) => {
      setTimeout(()=>{
        logger.error("Request player action Failed: %s action time out.", val.player);
        resolve(noneRes);
      },60*1000)
      targetUser.socket.once("resolve-signal", (para: CardPara) => {
        resolve(para);
      })
    });
    targetUser.socket.off("resolve-signal");
    await this.renew();
    return res;
  }

  startGame() {
    this.game = new UJIJCore(this.requester.bind(this));
    logger.verbose('Room %s started a new game.', this.roomName);
    this.renew();
  }

  addUser(user: User): boolean {
    if(this.hasUser(user)) {
      return true;
    } else if(this.users.length < this.roomSizeLimit) {
      this.users.push(user);
      this.renew();
      return true;
    } else {
      return false;
    }
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
    for(const pl of gameState.player) {
      if(pl.name !== this.users[id].userName) {
        for(let i = 0; i < pl.hand.length; ++i) {
          pl.hand[i] = "0";
        }
      }
    }
    return {
      state: this.game.getGameState(),
      signal: {},
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
    }else if(this.iterateSignal?.type === IterateSignalType.GAME_END){
      for(let i = 0; i < this.users.length; ++i) {
        logger.verbose('Game Result %s renew to user %s with id %s', this.iterateSignal.state, this.users[i]?.userName, i);
        this.users[i]?.emit('room-game-end', {
          gameResult: this.iterateSignal.state,
          roomState: roomState,
        });
      }
    }else{
      for(let i = 0; i < this.users.length; ++i) {
        logger.verbose('Gamestate %s renew to user %s with id %s', 1, this.users[i]?.userName, i);
        await this.users[i]?.emit('renew-game-state', this.gameStateGenerator(i));
      }
    }
  }

  iterate(user: User, signal: PlayerSignal) {
    let userID: number = -1;
    if(user.userName == this.users[0]?.userName) {
      userID = 0;
    }else if(user.userName == this.users[1]?.userName){
      userID = 1;
    }
    if(userID == -1) {
      logger.error("Player %s sent signal %s while not exist in room %s.", user.userName, signal, this.roomName);
      return;
    }else{
      logger.verbose("Player %s with ID %s sent signal %s to room %s.", user.userName, userID, signal, this.roomName);
    }
    if(this.iterateSignal == null || this.iterateSignal.type != IterateSignalType.REQUEST){
      logger.warn("Player %s with ID %s sent signal. But no iterateSignal requesting in room %s", user.userName, userID, this.roomName);
      return;
    }
    if(this.game == null){
      logger.warn("Player %s with ID %s sent signal. But there's no game running in room %s", user.userName, userID, this.roomName);
      return;
    }
    if(userID != this.iterateSignal.state[0] || signal.type != this.iterateSignal.state[1]) {
      logger.verbose("Player %s with ID %s sent signal %s. But not match iterateSignal %s in room %s.", user.userName, userID, signal, this.iterateSignal.state, this.roomName);
      return;
    }
    logger.silly("Game iterate and got new iterateSignal %s in room %s", this.iterateSignal, this.roomName);
    this.renew();
    return;
  }
}