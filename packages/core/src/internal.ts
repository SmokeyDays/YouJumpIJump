import { Session } from './session'
import { Context } from 'cordis'
import { Awaitable, coerce, defineProperty, Dict, escapeRegExp, makeArray } from '@koishijs/utils'

declare module 'cordis' {
  interface Context {
    $internal: Internal
    middleware(middleware: Middleware, prepend?: boolean): () => boolean
  }

  interface Events {
    // 'before-attach-channel'(session: Session, fields: Set<Channel.Field>): void
    // 'attach-channel'(session: Session): Awaitable<void | boolean>
    // 'before-attach-user'(session: Session, fields: Set<User.Field>): void
    // 'attach-user'(session: Session): Awaitable<void | boolean>
    // 'before-attach'(session: Session): void
    // 'attach'(session: Session): void
    'session'(session: Session): void
    'middleware'(session: Session): void
  }
}

export type Next = (next?: Next.Callback) => Promise<void | string>
export type Middleware = (session: Session, next: Next) => Awaitable<void | string>

export namespace Next {
  export const MAX_DEPTH = 64

  export type Queue = ((next?: Next) => Awaitable<void | string>)[]
  export type Callback = void | string | ((next?: Next) => Awaitable<void | string>)

  export async function compose(callback: Callback, next?: Next) {
    return typeof callback === 'function' ? callback(next) : callback
  }
}

export class Internal {
  static readonly methods = ['middleware']

  _hooks: [Context, Middleware][] = []
  _sessions: Dict<Session> = Object.create(null)

  constructor(private ctx: Context) {
    defineProperty(this, Context.current, ctx)

    // bind built-in event listeners
    // this.middleware(this._process.bind(this))
    // ctx.on('message', this._handleMessage.bind(this))
    ctx.on('session', this._prepare.bind(this))
  }

  protected get caller() {
    return this[Context.current]
  }

  middleware(middleware: Middleware, prepend = false) {
    return this.caller.lifecycle.register('middleware', this._hooks, middleware, prepend)
  }

  private async _prepare(session: Session) {
    // preparation
    this._sessions[session.id] = session
    const queue: Next.Queue = this._hooks
      .filter(([context]) => context.filter(session))
      .map(([, middleware]) => middleware.bind(null, session))

    // execute middlewares
    let index = 0, midStack = '', lastCall = ''
    // const { prettyErrors } = this.ctx.options
    const prettyErrors = true
    const next: Next = async (callback) => {
      if (prettyErrors) {
        lastCall = new Error().stack.split('\n', 3)[2]
        if (index) {
          const capture = lastCall.match(/\((.+)\)/)
          midStack = `\n  - ${capture ? capture[1] : lastCall.slice(7)}${midStack}`
        }
      }

      try {
        if (!this._sessions[session.id]) {
          throw new Error('isolated next function detected')
        }
        if (callback !== undefined) {
          queue.push(next => Next.compose(callback, next))
          if (queue.length > Next.MAX_DEPTH) {
            throw new Error(`middleware stack exceeded ${Next.MAX_DEPTH}`)
          }
        }
        return await queue[index++]?.(next)
      } catch (error) {
        let stack = coerce(error)
        if (prettyErrors) {
          const index = stack.indexOf(lastCall)
          if (index >= 0) {
            stack = stack.slice(0, index)
          } else {
            stack += '\n'
          }
          stack += `Middleware stack:${midStack}`
        }
        // this.ctx.logger('session').warn(`${session.content}\n${stack}`)
      }
    }

    try {
      await next()
      await session.stack.resolve()
    } finally {
      // update session map
      delete this._sessions[session.id]
      // this.ctx.emit(session, 'middleware', session)

      // // flush user & group data
      // this._userCache.delete(session.id)
      // this._channelCache.delete(session.id)
      // await session.user?.$update()
      // await session.channel?.$update()
      // await session.guild?.$update()
    }
  }
}

Context.service('$internal', Internal)

export namespace SharedCache {
  export interface Entry<T> {
    value: T
    key: string
    refs: Set<string>
  }
}

export class SharedCache<T> {
  #keyMap: Dict<SharedCache.Entry<T>> = Object.create(null)

  get(ref: string, key: string) {
    const entry = this.#keyMap[key]
    if (!entry) return
    entry.refs.add(ref)
    return entry.value
  }

  set(ref: string, key: string, value: T) {
    let entry = this.#keyMap[key]
    if (entry) {
      entry.value = value
    } else {
      entry = this.#keyMap[key] = { value, key, refs: new Set() }
    }
    entry.refs.add(ref)
  }

  delete(ref: string) {
    for (const key in this.#keyMap) {
      const { refs } = this.#keyMap[key]
      refs.delete(ref)
      if (!refs.size) {
        delete this.#keyMap[key]
      }
    }
  }
}
