import {
  MousetrapOptions,
  KeyInfo,
  MousetrapCallback,
  EventName,
  EventType,
  EventNoop,
} from './type'
import { MousetrapEvent } from './event'

const noop = () => {
  return false
}

class Mousetrap extends MousetrapEvent {
  // 和　_callbacks 一样， trigger() 手动触发时使用
  _directMap: Record<string, MousetrapCallback> = {}

  resetTimer: null | number = null

  static instance: Mousetrap | null = null

  constructor(options: MousetrapOptions = {}) {
    super()

    if (Mousetrap.instance) {
      return Mousetrap.instance
    }
    if (!(this instanceof Mousetrap)) {
      return new Mousetrap(options)
    }

    const { targetElement } = options
    if (!targetElement) {
      throw new TypeError(`targetElement required.`)
    }
    this.target = targetElement

    this.addEvent(targetElement, ['keypress', 'keydown', 'keyup'])
    Mousetrap.instance = this
  }

  /**
   * binds an event to mousetrap
   *
   * can be a single key, a combination of keys separated with +,
   * an array of keys, or a sequence of keys separated by spaces
   *
   * be sure to list the modifier keys first to make sure that the
   * correct key ends up getting bound (the last key in the pattern)
   */
  bind(
    keys: string | string[],
    callback: MousetrapCallback,
    action?: EventName
  ): EventNoop {
    keys = keys instanceof Array ? keys : [keys]
    this.bindMultiple(keys, callback, action)
    return () => this.unbind(keys, action)
  }

  unbind(keys: string | string[], action?: EventName): EventNoop {
    return this.bind(keys, noop, action)
  }

  bindMultiple(
    keys: string[],
    callback: MousetrapCallback,
    action?: EventName
  ) {
    for (let i = 0; i < keys.length; i++) {
      this.bindSingle(keys[i], callback, action)
    }
  }

  trigger(keys: string | string[], action: EventName): Mousetrap {
    if (this._directMap[keys + ':' + action]) {
      this._directMap[keys + ':' + action]({} as any, keys as any)
    }
    return this
  }

  reset() {
    this._callbacks = {}
    this._directMap = {}
    return this
  }

  resetSequenceTimer() {
    clearTimeout(this.resetTimer as number)
    this.resetTimer = setTimeout(this.resetSequences.bind(this), 1000)
  }

  bindSequence(
    combo: string,
    keys: string[],
    callback: MousetrapCallback,
    action?: EventName
  ) {
    // start off by adding a sequence level record for this combination
    // and setting the level to 0
    this._sequenceLevels[combo] = 0

    /**
     * callback to increase the sequence level for this sequence and reset
     * all other sequences that were active
     */
    const _increaseSequence = (nextAction: string) => {
      return () => {
        this._nextExpectedAction = nextAction
        ++(this._sequenceLevels[combo] as number)
        this.resetSequenceTimer()
      }
    }

    /**
     * wraps the specified callback inside of another function in order
     * to reset all sequence counters as soon as this sequence is done
     */
    const _callbackAndReset = (e: EventType) => {
      this.fireCallback(callback, e, combo)

      // we should ignore the next key up if the action is key down
      // or keypress.  this is so if you finish a sequence and
      // release the key the final key will not trigger a keyup
      if (action !== 'keyup') {
        this._ignoreNextKeyup = this.lowerKeyName(e.key)
      }

      // weird race condition if a sequence ends with the key
      // another sequence begins with
      setTimeout(this.resetSequences.bind(this), 10)
    }

    // loop through keys one at a time and bind the appropriate callback
    // function.  for any key leading up to the final one it should
    // increase the sequence. after the final, it should reset all sequences
    //
    // if an action is specified in the original bind call then that will
    // be used throughout.  otherwise we will pass the action that the
    // next key in the sequence should match.  this allows a sequence
    // to mix and match keypress and keydown events depending on which
    // ones are better suited to the key provided
    for (let i = 0; i < keys.length; ++i) {
      const isFinal = i + 1 === keys.length
      const wrappedCallback = isFinal
        ? _callbackAndReset
        : _increaseSequence(action || this.getKeyInfo(keys[i + 1]).action)
      this.bindSingle(
        keys[i],
        wrappedCallback as MousetrapCallback,
        action,
        combo,
        i
      )
    }
  }

  bindSingle(
    key: string,
    callback: MousetrapCallback,
    action?: EventName,
    sequenceName?: string,
    level?: number
  ) {
    // store a direct mapped reference for use with Mousetrap.trigger
    this._directMap[key + ':' + action] = callback

    // make sure multiple spaces in a row become a single space
    key = key.replace(/\s+/g, ' ')

    const sequence = key.split(' ')
    let info: KeyInfo | undefined = undefined

    // if this pattern is a sequence of keys then run through this method
    // to reprocess each pattern one key at a time
    if (sequence.length > 1) {
      this.bindSequence(key, sequence, callback, action)
      return
    }

    info = this.getKeyInfo(key, action)

    // make sure to initialize array if this is the first time
    // a callback is added for this key
    this._callbacks[info.key] = this._callbacks[info.key] || []

    // remove an existing match if there is one
    this.getMatches(
      info.key,
      info.modifiers,
      { type: info.action },
      sequenceName,
      key,
      level
    )

    // add this call back to the array
    // if it is a sequence put it at the beginning
    // if not put it at the end
    //
    // this is important because the way these are processed expects
    // the sequence ones to come first
    this._callbacks[info.key][sequenceName ? 'unshift' : 'push']({
      callback,
      modifiers: info.modifiers,
      action: info.action,
      seq: sequenceName,
      level: level,
      combo: key,
    })
  }
}

export default Mousetrap
