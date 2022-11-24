import { type ActionMap, Types } from './actions'

export enum EmacsDataTypes {
  NULL, // 默认
  KEYMAP, // 按键映射
  ARTICLES, // 文章列表
}

export interface EmacsDataItem {
  key: string
  value: string
  // ???
}

export interface EmacsArticleItem extends EmacsDataItem {
  title: string
}

export interface EmacsPopupBufferData {
  type: EmacsDataTypes
  data: EmacsDataItem[]
}

export interface EmacsMiniBufferData {
  left?: string
  right?: string
}

export interface EmacsStateType {
  popupBuffer: EmacsPopupBufferData
  miniBuffer: EmacsMiniBufferData
  articles?: EmacsArticleItem[]
}

export interface EmacsPayload {
  [Types.SET_EMACS_KEYMAP]: Record<string, string>
  [Types.SET_EMACS_POPUP_BUFFER]: EmacsPopupBufferData
  [Types.RESET_EMACS_POPUP_BUFFER]: undefined
  [Types.SET_EMACS_MINI_BUFFER]: EmacsMiniBufferData
  [Types.RESET_EMACS_MINI_BUFFER]: undefined
  [Types.SET_EMACS_ARTICLE_LIST]: EmacsArticleItem[]
}

export type EmacsActions =
  ActionMap<EmacsPayload>[keyof ActionMap<EmacsPayload>]

export const emacsReducer = (state: EmacsStateType, action: EmacsActions) => {
  switch (action.type) {
    case Types.SET_EMACS_POPUP_BUFFER:
      return {
        ...state,
        popupBuffer: action.payload,
      }
    case Types.RESET_EMACS_POPUP_BUFFER:
      return {
        ...state,
        popupBuffer: {
          type: EmacsDataTypes.NULL,
          data: [],
        },
      }
    case Types.SET_EMACS_MINI_BUFFER:
      return {
        ...state,
        // 可以单独更新 left 或 right, dispatch({type, payload: { left }})
        miniBuffer: {
          ...state.miniBuffer,
          ...action.payload,
        },
      }
    case Types.RESET_EMACS_MINI_BUFFER:
      // 只需要重置左边的，右边是一些固定不动的信息(如：时间，日期，等)
      return {
        ...state,
        miniBuffer: {
          ...state.miniBuffer,
          left: 'Hello Emacser !',
        },
      }
    default:
      return state
  }
}
