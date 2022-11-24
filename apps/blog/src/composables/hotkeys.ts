import { useCallback } from 'react'
import { EmacsDataTypes, Types, EmacsPayload, useStore } from '../store'
import keymaps from '../data/keymap.json'
import { MousetrapCallback } from '@aftt/shared-utils/mousetrap'
import { useMousetrapBind } from './mousetrap'

export function useHotkeyBind<Key>(
  keyStroke: string,
  type: Key,
  payload: EmacsPayload<Key>
) {
  const { dispatch } = useStore()
  const contrlHCallback = useCallback<MousetrapCallback>(() => {
    payload && dispatch({ type, payload })
  }, [dispatch, type, payload])
  useMousetrapBind(keyStroke, contrlHCallback)
}

export function useHelpHotkey() {
  const keyStroke = 'control+h'
  useHotkeyBind<Types.SET_EMACS_POPUP_BUFFER>(
    keyStroke,
    Types.SET_EMACS_POPUP_BUFFER,
    {
      type: EmacsDataTypes.KEYMAP,
      data: keymaps[keyStroke],
    }
  )
}

export function useAbortHotkey() {}

export function useHotkeys() {
  // Control + h, help info
  useHelpHotkey()

  // Control + g, cancel or abort
  useAbortHotkey()
}
