import { Context } from "cordis"
import { Player } from './player'
import * as lifecycle from './lifecycle'
import { Deck, GameStage, GameStep } from "./regulates/type"
import { type } from "os"
import { Slot, SlotList } from "./regulates/interfaces"
export interface GameState {
  playerState: Player[],
  process: {
    stage: GameStage,
    step: GameStep,
    /* 0: Alice, 1: Bob */
    priority: number,
    turn: number,
    round: number,
  }
}
declare module 'cordis' {
  
  export interface Context {
    duel: GameState
  }

  export interface Events {
    //game event
    'game-start': () => void
    'game-end': () => void

    //turn event
    'turn-instant': (id: number) => void
    'turn-main': (id: number) => void
    'turn-drop': () => void

    //player event
    'player-play': (id: number) => void
    'player-masteryup': (id:number) => void
    'player-masterydown': (id:number) => void
    'player-getcard': (id:number, fool:boolean) => void
    
    //card event
    'card-AH': (id: number, pos: SlotList) => void
    'card-AP': (id: number, pos: SlotList) => void
    'card-AN': (id: number, pos: SlotList) => void
    'card-2': (id: number, pos: SlotList, opt: boolean) => void
    'card-3': (id: number, pos: SlotList) => void
    'card-4': (id: number, pos: SlotList) => void
    'card-5': (id: number, cardset: number[]) => void
    'card-6': (id: number) => void
    'card-7': (id: number) => void
    'card-8': (id: number, pos: SlotList) => void
    'card-9': (id: number, pos: SlotList) => void
    'card-10': (id: number, pos: SlotList) => void
    'card-J': (id: number, pos: SlotList) => void
    'card-Q': (id: number, pos: SlotList) => void
    'card-K': (id: number) => void
    'card-BJ': (id: number) => void
    'card-RJ': (id: number) => void
    'card-0': (id: number) => void
  }
  
}

export function duelInit(app: Context) {
  /*app.on('duel-start', (decks: Deck[]) => {
    app.duel.playerState = [new Player(app, {id: 0, deck: decks[0]}), new Player(app, {id: 1, deck: decks[1]})];
  });

  app.emit('duel-start', []);*/


  
  // app.socket.on('message', (msg) => {
  //   ctx.emit('session', {

  //   })
  // })
  // app.stage('prepare').middleware((session) => {
  //   ctx.emit('session', {
  //     player: session.player,
  //     stage: 'battle'
  //       type: 'stage-battle',
  //   })
  // })
  // app.stage('battle').middleware((session) => {
  //   // 玩家在栈为空的情况下 pass ，且当前是战斗阶段，则进入结束阶段。
  //   ctx.emit('session', {
  //     player: session.player,
  //     stage: 'action'
  //       type: 'stage-action',
  //   })
  // })
  // app.stage('action').middleware((session) => {
  //   // 玩家在栈为空的情况下 pass ，且当前是行动阶段，则进入结束阶段。
  //   ctx.emit('session', {
  //     player: session.player,
  //     stage: 'end'
  //       type: 'stage-end',
  //   })
  // })
  // app.stage('end').stageEmpty().middleware(() => {
  //   // 下面的部份应当在玩家弃牌完成之后进行。
  //   ctx.emit('session', {
  //     player: session.player ^ 1,
  //     stage: 'prepare',
  //     type: 'stage-prepare'
  //   })
  // })

  // app.start()
  return app;
}

