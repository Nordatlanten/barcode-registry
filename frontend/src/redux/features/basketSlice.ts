import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Product } from '../../types/ProductTypes'

type InitialState = {
  value: BasketState
}

type BasketState = {
  basket: Product[],
  basketHistory: Array<Product[]>
}

const initialState = {
  value: {
    basket: [],
    basketHistory: []
  } as BasketState
} as InitialState

export const basketSlice = createSlice({
  name: 'Basket slice',
  initialState,
  reducers: {
    addProductToBasket: (state, action: PayloadAction<Product>) => {
      return {
        value: {
          basket: [...state.value.basket, action.payload],
          basketHistory: state.value.basketHistory

        }
      }
    },
    updateBasket: (state, action: PayloadAction<Product[]>) => {
      return {
        value: {
          basket: action.payload,
          basketHistory: state.value.basketHistory
        }
      }
    },
    resetBasket: (state) => {
      return {
        value: {
          basket: [],
          basketHistory: state.value.basketHistory
        }
      }
    },
    addBasketToBasketHistory: (state, action: PayloadAction<Product[]>) => {
      return {
        value: {
          basket: state.value.basket,
          basketHistory: [...state.value.basketHistory, action.payload]
        }
      }
    },
    resetBasketHistory: (state) => {
      return {
        value: {
          basket: state.value.basket,
          basketHistory: []
        }
      }
    }
  }
})

export const { addBasketToBasketHistory, addProductToBasket, resetBasket, resetBasketHistory, updateBasket } = basketSlice.actions
export default basketSlice.reducer
