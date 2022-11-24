import { useCallback } from 'react'
import { EmacsDataTypes, Types, useStore } from '../store'
import keymaps from '../data/keymap.json'
import { MousetrapCallback } from '@aftt/shared-utils/mousetrap'
import { useMousetrapBind } from './mousetrap'

export function useHotkeyBind(
  keyStroke: string,
  type: Types,
  payload?: unknown
) {
  const { dispatch } = useStore()
  const contrlHCallback = useCallback<MousetrapCallback>(() => {
    payload && dispatch({ type, payload })
  }, [dispatch, type, payload])
  useMousetrapBind(keyStroke, contrlHCallback)
}

export function useHelpHotkey() {
  const keyStroke = 'control+h'
  useHotkeyBind(keyStroke, Types.SET_EMACS_POPUP_BUFFER, {
    type: EmacsDataTypes.KEYMAP,
    data: keymaps[keyStroke],
  })
}

export function useAbortHotkey() {
  useHotkeyBind('control+g', Types.RESET_EMACS_POPUP_BUFFER)
}

export function useHotkeys() {
  // Control + h, help info
  useHelpHotkey()

  // Control + g, cancel or abort
  useAbortHotkey()
}
