export type TargetElement = (HTMLElement & Element) | HTMLDivElement | Document
export type EventName = 'keydown' | 'keypress' | 'keyup'
export type EventType = KeyboardEvent
export type EventCallback = (e: EventType) => void
export type EventModifiers = string[]
export type EventNoop = () => void

export interface MousetrapOptions {
  targetElement?: TargetElement
}

export type MousetrapCallback = (e: EventType, combo?: string) => boolean | void

export interface MousetrapCallbackRecord {
  callback: MousetrapCallback
  seq?: string
  level?: number
  action?: string
  modifiers: string[]
  combo?: string
}

export interface MousetrapCallbacks {
  [key: string]: MousetrapCallbackRecord[]
}

export interface KeyInfo {
  key: string
  modifiers: string[]
  action: string
}
