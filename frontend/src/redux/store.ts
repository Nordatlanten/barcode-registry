import { configureStore } from '@reduxjs/toolkit'
import newProductReducer from './features/newProductSlice'
import basketSlice from './features/basketSlice'
import applicationControlSlice from './features/applicationControlSlice'

import { TypedUseSelectorHook, useSelector } from 'react-redux'

export const store = configureStore({
  reducer: {
    applicationControlSlice,
    basketSlice,
    newProductReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
