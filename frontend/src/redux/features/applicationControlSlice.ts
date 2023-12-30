import { createSlice, PayloadAction } from '@reduxjs/toolkit'


type InitialState = {
  value: ApplicationState
}

type ApplicationState = {
  displayNewProductForm: boolean
}

const initialState = {
  value: {
    displayNewProductForm: false
  } as ApplicationState
} as InitialState

export const applicationState = createSlice({
  name: 'Application control state',
  initialState,
  reducers: {
    hideNewProductForm: (state) => {
      return {
        value: {
          displayNewProductForm: false
        }
      }
    },
    showNewProductForm: (state) => {
      return {
        value: {
          displayNewProductForm: true
        }
      }
    },

  }
})

export const { hideNewProductForm, showNewProductForm } = applicationState.actions
export default applicationState.reducer
