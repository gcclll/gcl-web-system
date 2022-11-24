import { useContext } from 'react'
import { createStore } from '@aftt/react-ui'
import {
  type EmacsActions,
  type EmacsStateType,
  emacsReducer,
  EmacsDataTypes,
} from './reducers'

export interface InitialStateType {
  emacs: EmacsStateType
  showAside?: boolean
}

const initialState = {
  products: [],
  shoppingCart: 0,
  emacs: {
    // 弹出式 Buffer, 会根据按键显示不同类型的数据，主要分为三类
    // 1. 按键列表，2. 文章类型(`C-c n f` 触发)，3. Help 类型
    popupBuffer: {
      type: EmacsDataTypes.KEYMAP,
      data: [],
    },
    // 底部固定的 Mini Buffer 显示的内容(分左右)
    miniBuffer: {
      left: 'Hello Emacser !',
      right: '2022-10-27 09:52:57',
    },
    // 右边的目录
    showAside: false,
  },
}

// 所有 reducer 类型
export type ReducerActions = EmacsActions

// 每个状态都有自己的 reducer
const reducer = (state: InitialStateType, action: ReducerActions) => ({
  emacs: emacsReducer(state.emacs, action as EmacsActions),
})

function initStore() {
  const { context, StateProvider } = createStore<
    InitialStateType,
    ReducerActions
  >(reducer, initialState)

  return { context, StateProvider }
}

const _ = initStore()

export function useStore() {
  return useContext(_.context)
}

export * from './reducers'

export default _
