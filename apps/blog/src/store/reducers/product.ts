import { type ActionMap, Types } from './actions'

export interface ProductType {
  id: number
  name: string
  price: number
}

export interface ProductPayload {
  [Types.CREATE_PRODUCT]: {
    id: number
    name: string
    price: number
  }
  [Types.DELETE_PRODUCT]: {
    id: number
  }
}

export type ProductActions =
  ActionMap<ProductPayload>[keyof ActionMap<ProductPayload>]

export const productReducer = (
  state: ProductType[],
  action: ProductActions
) => {
  switch (action.type) {
    case Types.CREATE_PRODUCT:
      return [
        ...state,
        {
          ...action.payload,
        },
      ]
    case Types.DELETE_PRODUCT:
      return [...state.filter((product) => product.id !== action.payload.id)]
    default:
      return state
  }
}
