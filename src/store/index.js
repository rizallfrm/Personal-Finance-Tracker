import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import accountsReducer from './slice/accountSlice';
import transactionsReducer from './slice/transactionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    accounts: accountsReducer,
    transactions: transactionsReducer
  },

});