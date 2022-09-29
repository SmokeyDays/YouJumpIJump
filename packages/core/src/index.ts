import { Context } from "cordis"
import { GameState } from "./regulates/interfaces"


export function duelInit(app: Context) {
  app.on('duel-start', () => {
    // app.duel.playerState = [new Player(app, {initialMastery: 10}), new Player(app, {initialMastery: 10})];
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

