import { Context } from 'cordis'
import { Player } from './player'

export type Session = {
  type: 'draw',
  player: Player,
  num: number
} | {
  type: 'none'
}


export function apply(ctx: Context) {
  Context.service('')
}
