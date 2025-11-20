import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux'
import authSlice from './AuthSlice'
import cartSlice from './customer/cartSlice'
import orderSlice from './customer/orderSlice'
import productSlice from './customer/ProductSlice'
import sellerProductSlice from './seller/sellerProductSlice'
import sellerSlice from './seller/sellerSlice'

const rootReducer = combineReducers({
  //Store seller login state
  seller: sellerSlice,
  //Store seller products
  sellerProduct: sellerProductSlice,
  product: productSlice,
  auth: authSlice,
  cart: cartSlice,
  order: orderSlice
})

const store = configureStore({
  reducer: rootReducer
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof rootReducer>

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
