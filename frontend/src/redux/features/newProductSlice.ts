import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Category, Deal, Subcategory } from '../../types/ProductTypes'

type InitialState = {
  value: NewProductState
}

type NewProductState = {
  barcode: string,
  price: number,
  category: Category,
  subcategory: Subcategory,
  deals: Deal[]
}

const initialState = {
  value: {
    barcode: "",
    price: 0,
    category: { title: "", subcategories: [] },
    subcategory: { title: "" },
    deals: []
  } as NewProductState
} as InitialState

export const newProduct = createSlice({
  name: 'New product',
  initialState,
  reducers: {
    selectBarcode: (state, action: PayloadAction<string>) => {
      return {
        value: {
          barcode: action.payload,
          price: state.value.price,
          category: state.value.category,
          subcategory: state.value.subcategory,
          deals: state.value.deals
        }
      }
    }
  }
})

export const { selectBarcode } = newProduct.actions
export default newProduct.reducer
