import { Context } from "cordis"
import { Player } from './player'
import * as lifecycle from './lifecycle'
import { Deck, GameStage, GameStep } from "./regulates/type"
import { WudingCoreOutputSignal } from "../WudingCore"
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
    // duel event
    'duel-start': (decks: Deck[]) => void
    'duel-end': () => void

    // turn event
    'stage-prepare': (id: number) => void
    'stage-battle': () => void
    'stage-action': () => void
    'stage-end': () => void

    // player event
    'player-cast': () => void
    'player-draw': (id: number) => void
    'player-grow': (id: number) => void
    'player-discard': (id: number) => void
    'player-attack': (id: number) => void
    'player-damage': (id: number) => void
    'player-shuffle': (id: number) => void

    // card event
    'card-place': () => void
    'card-effect': () => void
    'card-resolve': () => void
    'card-untap': () => void

    // socket event
    'output-message': (signal: WudingCoreOutputSignal) => void
  }
}

export function duelInit(app: Context) {
  app.on('duel-start', (decks: Deck[]) => {
    app.duel.playerState = [new Player(app, {id: 0, deck: decks[0]}), new Player(app, {id: 1, deck: decks[1]})];
  });
  
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

