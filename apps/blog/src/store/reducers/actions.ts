export type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key
      }
    : {
        type: Key
        payload: M[Key]
      }
}

export enum Types {
  CREATE_PRODUCT = 'CREATE_PRODUCT',
  DELETE_PRODUCT = 'DELETE_PRODUCT',
  ADD_PRODUCT = 'ADD_PRODUCT',
  // emacs
  SET_EMACS_KEYMAP = 'SET_EMACS_KEYMAP',
  // 弹出式 popup buffer
  SET_EMACS_POPUP_BUFFER = 'SET_EMACS_POPUP_BUFFER',
  RESET_EMACS_POPUP_BUFFER = 'RESET_EMACS_POPUP_BUFFER',
  // 设置文章列表，需要从服务端请求，通过解析 /public/posts/ 下的
  SET_EMACS_ARTICLE_LIST = 'SET_EMACS_ARTICLE_LIST',
  // 底部固定的 Mini buffer
  SET_EMACS_MINI_BUFFER = 'SET_EMACS_MINI_BUFFER',
  RESET_EMACS_MINI_BUFFER = 'RESET_EMACS_MINI_BUFFER',
}
