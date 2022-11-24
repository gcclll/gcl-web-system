import { type ActionMap, Types } from './actions'

export interface ShoppingCartPayload {
  [Types.ADD_PRODUCT]: undefined
}

export type ShoppingCartActions =
  ActionMap<ShoppingCartPayload>[keyof ActionMap<ShoppingCartPayload>]

export const shoppingCartReducer = (
  state: number,
  action: ShoppingCartActions
) => {
  switch (action.type) {
    case Types.ADD_PRODUCT:
      return state + 1
    default:
      return state
  }
}
