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
    },
    selectCategory: (state, action: PayloadAction<Category>) => {
      return {
        value: {
          barcode: state.value.barcode,
          price: state.value.price,
          category: action.payload,
          subcategory: state.value.subcategory,
          deals: state.value.deals
        }
      }
    },
    selectSubcategory: (state, action: PayloadAction<Subcategory>) => {
      return {
        value: {
          barcode: state.value.barcode,
          price: state.value.price,
          category: state.value.category,
          subcategory: action.payload,
          deals: state.value.deals
        }
      }
    },
    resetNewProductState: (state) => {
      return {
        value: {
          barcode: "",
          price: 0,
          category: { title: "", subcategories: [] },
          subcategory: { title: "" },
          deals: []
        }
      }
    }
  }
})

export const { selectBarcode, selectCategory, selectSubcategory, resetNewProductState } = newProduct.actions
export default newProduct.reducer
