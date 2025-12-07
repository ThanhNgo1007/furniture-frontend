import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux'
import adminDashboardSlice from './admin/adminDashboardSlice'
import adminSellerSlice from './admin/adminSellerSlice'
import dealSlice from './admin/dealSlice'
import authSlice from './AuthSlice'
import chatSlice from './chatSlice'
import cartSlice from './customer/cartSlice'
import customerSlice from './customer/customerSlice'
import orderSlice from './customer/orderSlice'
import productSlice from './customer/ProductSlice'
import reviewSlice from './customer/reviewSlice'
import wishlistSlice from './customer/wishlistSlice'
import sellerDashboardSlice from './seller/sellerDashboardSlice'
import sellerOrderSlice from './seller/sellerOrderSlice'
import sellerProductSlice from './seller/sellerProductSlice'
import sellerSlice from './seller/sellerSlice'
import transactionSlice from './seller/transactionSlice'

const rootReducer = combineReducers({
  //Store seller login state
  seller: sellerSlice,
  //Store seller products
  sellerProduct: sellerProductSlice,
  product: productSlice,
  auth: authSlice,
  cart: cartSlice,
  order: orderSlice,
  wishlist: wishlistSlice,
  review: reviewSlice,
  sellerOrder: sellerOrderSlice,
  transactions: transactionSlice,
  home: customerSlice,
  deal: dealSlice,
  adminSeller: adminSellerSlice,
  sellerDashboard: sellerDashboardSlice,
  adminDashboard: adminDashboardSlice,
  chat: chatSlice
})


const store = configureStore({
  reducer: rootReducer
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof rootReducer>

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
