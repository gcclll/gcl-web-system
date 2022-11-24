import {
  TargetElement,
  EventName,
  KeyInfo,
  MousetrapCallback,
  MousetrapCallbackRecord,
  EventType,
  EventModifiers,
  MousetrapCallbacks,
} from './type'

export class MousetrapEvent {
  target: TargetElement | undefined = undefined

  /**
   * temporary state where we will ignore the next keyup
   */
  _ignoreNextKeyup: boolean | string = false

  //　保存 mousetrap.bind() 绑定的　key -> callback[] 对应关系
  _callbacks: MousetrapCallbacks = {}

  /**
   * keeps track of what level each sequence is at since multiple
   * sequences can start out with the same sequence
   */
  _sequenceLevels: Record<string, number | string> = {}

  /**
   * temporary state where we will ignore the next keypress
   */
  _ignoreNextKeypress = false
  /**
   * are we currently inside of a sequence?
   * type of action ("keyup" or "keydown" or "keypress") or false
   */
  _nextExpectedAction: boolean | string = false

  handleKeyEvent(e: EventType) {
    const key = e.key.toLowerCase()
    // need to use === for the character check because the character can be 0
    if (e.type === 'keyup' && this._ignoreNextKeyup === key) {
      this._ignoreNextKeyup = false
      return
    }
    this.handleKey(key, this.eventModifiers(e), e)
  }

  /**
   * takes a key event and figures out what the modifiers are
   */
  eventModifiers(e: EventType): string[] {
    const modifiers = []
    if (e.shiftKey) modifiers.push('shift')
    if (e.altKey) modifiers.push('alt')
    if (e.ctrlKey) modifiers.push('control')
    if (e.metaKey) modifiers.push('meta')
    return modifiers
  }

  addEvent(target: TargetElement, type: EventName | EventName[]) {
    if (typeof type !== 'string') {
      type.forEach((name: EventName) => this.addEvent(target, name))
    } else {
      const callback = (e: Event) => this.handleKeyEvent(e as EventType)

      if (target.addEventListener) {
        target.addEventListener(type, callback, false)
        return
      }

      // no IE
      // ;(target as any)?.attachEvent('on' + type, callback)
    }
  }

  /**
   * 找到所有与键值，修饰符，action匹配的回调函数
   */
  getMatches(
    key: string,
    modifiers: EventModifiers,
    e: EventType | { type: string },
    sequenceName?: string,
    combination?: string,
    level?: number
  ): MousetrapCallbackRecord[] {
    let i: number
    let callback: MousetrapCallbackRecord
    const matches = []
    const action = e.type

    if (!this._callbacks[key]) {
      return []
    }

    if (action === 'keyup' && this.isModifier(key)) {
      modifiers = [key]
    }

    for (i = 0; i < this._callbacks[key].length; ++i) {
      callback = this._callbacks[key][i]

      // if a sequence name is not specified, but this is a sequence at
      // the wrong level then move onto the next match
      if (
        !sequenceName &&
        callback.seq &&
        this._sequenceLevels[callback.seq] !== callback.level + ''
      ) {
        continue
      }

      // if the action we are looking for doesn't match the action we got
      // then we should keep going
      if (action !== callback.action) {
        continue
      }

      // if this is a keypress event and the meta key and control key
      // are not pressed that means that we need to only look at the
      // character, otherwise check the modifiers as well
      //
      // chrome will not fire a keypress if meta or control is down
      // safari will fire a keypress if meta or meta+shift is down
      // firefox will fire a keypress if meta or control is down
      const event = e as EventType
      if (
        (action === 'keypress' && !event.metaKey && !event.altKey) ||
        this.modifiersMatch(modifiers, callback.modifiers)
      ) {
        // when you bind a combination or sequence a second time it
        // should overwrite the first one.  if a sequenceName or
        // combination is specified in this call it does just that
        //
        // @todo make deleting its own method?
        const deleteCombo = !sequenceName && callback.combo === combination
        const deleteSequence =
          sequenceName &&
          callback.seq == sequenceName &&
          callback.level == level
        if (deleteCombo || deleteSequence) {
          this._callbacks[key].splice(i, 1)
        }

        matches.push(callback)
      }
    }

    return matches
  }

  modifiersMatch(m1: string[], m2: string[]): boolean {
    return m1.sort().join(',') === m2.sort().join(',')
  }

  isModifier(key: string): boolean {
    return (
      key === 'shift' || key === 'control' || key === 'alt' || key === 'meta'
    )
  }

  lowerKeyName(key: string) {
    return key.toLowerCase()
  }

  getKeyInfo(key: string, action?: string): KeyInfo {
    let keys: string[] = []
    // let key: string
    let i: number
    const modifiers: string[] = []

    keys = this.keysFromString(key)
    for (i = 0; i < keys.length; ++i) {
      key = keys[i]
      if (this.isModifier(key)) {
        modifiers.push(key)
      }
    }

    // depending on what the key combination is
    // we will try to pick the best event for it
    action = this.pickBestAction(key, modifiers, action)
    return {
      key,
      modifiers,
      action,
    }
  }

  pickBestAction(key: string, modifiers: string[], action?: string) {
    const nk = +key
    if (!action) {
      action = nk >= 0 && nk <= 9 ? 'keypress' : 'keydown'
    }
    if (action === 'keypress' && modifiers.length) {
      action = 'keydown'
    }
    return action
  }

  keysFromString(key: string): string[] {
    if (key === '+') {
      return ['+']
    }

    key = key.replace(/\+{2}/g, '+plus')
    return key.split('+')
  }

  handleKey(key: string, modifiers: string[], e: EventType) {
    const callbacks = this.getMatches(key, modifiers, e)
    let i: number
    const doNotReset: Record<string, number> = {}
    let maxLevel = 0
    let processedSequenceCallback = false

    // Calculate the maxLevel for sequences so we can only execute the longest callback sequence
    for (i = 0; i < callbacks.length; ++i) {
      if (callbacks[i].seq) {
        maxLevel = Math.max(maxLevel, callbacks[i].level || 0)
      }
    }

    // loop through matching callbacks for this key event
    for (i = 0; i < callbacks.length; ++i) {
      // fire for all sequence callbacks
      // this is because if for example you have multiple sequences
      // bound such as "g i" and "g t" they both need to fire the
      // callback for matching g cause otherwise you can only ever
      // match the first one
      if (callbacks[i].seq) {
        // only fire callbacks for the maxLevel to prevent
        // subsequences from also firing
        //
        // for example 'a option b' should not cause 'option b' to fire
        // even though 'option b' is part of the other sequence
        //
        // any sequences that do not match here will be discarded
        // below by the _resetSequences call
        if (callbacks[i].level != maxLevel) {
          continue
        }

        processedSequenceCallback = true

        // keep a list of which sequences were matches for later
        doNotReset[callbacks[i].seq + ''] = 1
        this.fireCallback(
          callbacks[i].callback,
          e,
          callbacks[i].combo,
          callbacks[i].seq
        )
        continue
      }

      // if there were no sequence matches but we are still here
      // that means this is a regular match so we should fire that
      if (!processedSequenceCallback) {
        this.fireCallback(callbacks[i].callback, e, callbacks[i].combo)
      }
    }

    // if the key you pressed matches the type of sequence without
    // being a modifier (ie "keyup" or "keypress") then we should
    // reset all sequences that were not matched by this event
    //
    // this is so, for example, if you have the sequence "h a t" and you
    // type "h e a r t" it does not match.  in this case the "e" will
    // cause the sequence to reset
    //
    // modifier keys are ignored because you can have a sequence
    // that contains modifiers such as "enter ctrl+space" and in most
    // cases the modifier key will be pressed before the next key
    //
    // also if you have a sequence such as "ctrl+b a" then pressing the
    // "b" key will trigger a "keypress" and a "keydown"
    //
    // the "keydown" is expected when there is a modifier, but the
    // "keypress" ends up matching the _nextExpectedAction since it occurs
    // after and that causes the sequence to reset
    //
    // we ignore keypresses in a sequence that directly follow a keydown
    // for the same character
    const ignoreThisKeypress = e.type == 'keypress' && this._ignoreNextKeypress
    if (
      e.type == this._nextExpectedAction &&
      !this.isModifier(key) &&
      !ignoreThisKeypress
    ) {
      this.resetSequences(doNotReset)
    }

    this._ignoreNextKeypress = processedSequenceCallback && e.type == 'keydown'
  }

  /**
   * actually calls the callback function
   *
   * if your callback function returns false this will use the jquery
   * convention - prevent default and stop propogation on the event
   */
  fireCallback(
    callback: MousetrapCallback,
    e: EventType,
    combo?: string,
    sequence?: string
  ) {
    // if this event should not happen stop here
    if (
      this.stopCallback(e, (e as any).target || e.srcElement, combo, sequence)
    ) {
      return
    }

    if (callback(e, combo) === false) {
      this.preventDefault(e)
      this.stopPropagation(e)
    }
  }

  stopCallback(
    e: EventType,
    element: TargetElement,
    combo?: string,
    sequence?: string
  ) {
    // if the element has the class "mousetrap" then no need to stop
    if ((' ' + (element as any).className + ' ').indexOf(' mousetrap ') > -1) {
      return false
    }

    if (this.belongsTo(element, this.target)) {
      return false
    }

    // Events originating from a shadow DOM are re-targetted and `e.target` is the shadow host,
    // not the initial event target in the shadow tree. Note that not all events cross the
    // shadow boundary.
    // For shadow trees with `mode: 'open'`, the initial event target is the first element in
    // the event’s composed path. For shadow trees with `mode: 'closed'`, the initial event
    // target cannot be obtained.
    if ('composedPath' in e && typeof e.composedPath === 'function') {
      // For open shadow trees, update `element` so that the following check works.
      const initialEventTarget = e.composedPath()[0]
      if (initialEventTarget !== e.target) {
        element = initialEventTarget as TargetElement
      }
    }

    // stop for input, select, and textarea
    const ele = element as Element & HTMLElement
    return (
      ele.tagName == 'INPUT' ||
      ele.tagName == 'SELECT' ||
      ele.tagName == 'TEXTAREA' ||
      ele.isContentEditable
    )
  }

  belongsTo(
    element: TargetElement,
    ancestor: TargetElement | undefined
  ): boolean {
    if (element === null || element === document) {
      return false
    }

    if (element === ancestor) {
      return true
    }

    return this.belongsTo(element.parentNode as TargetElement, ancestor)
  }

  /**
   * stops propogation for this event
   */
  stopPropagation(e: EventType) {
    if (e.stopPropagation) {
      e.stopPropagation()
      return
    }

    e.cancelBubble = true
  }

  preventDefault(e: EventType) {
    if (e.preventDefault) {
      e.preventDefault()
      return
    }

    e.returnValue = false
  }

  resetSequences(doNotReset: Record<string, number>) {
    doNotReset = doNotReset || {}

    let activeSequences = false

    for (const key in this._sequenceLevels) {
      if (doNotReset[key]) {
        activeSequences = true
        continue
      }
      this._sequenceLevels[key] = 0
    }

    if (!activeSequences) {
      this._nextExpectedAction = false
    }
  }
}
