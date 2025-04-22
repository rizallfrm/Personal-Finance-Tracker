import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/src/lib/axios';

export const fetchAccounts = createAsyncThunk(
  'accounts/fetchAccounts',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get('/accounts', {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      return response.data.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw rejectWithValue({ message: 'Session expired' });
      }
      return rejectWithValue(error.response?.data || { message: 'Network error' });
    }
  }
);

// Tambahkan createAsyncThunk untuk membuat akun baru
export const createAccount = createAsyncThunk(
  'accounts/createAccount',
  async (accountData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.post('/accounts', accountData, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create account' });
    }
  }
);

const accountsSlice = createSlice({
  name: 'accounts',
  initialState: {
    account: [],
    items: [],
    loading: false,
    error: null,
    createStatus: 'idle' // 'idle' | 'loading' | 'succeeded' | 'failed'
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetCreateStatus: (state) => {
      state.createStatus = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchAccounts
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch accounts';
      })
      
      // Handle createAccount
      .addCase(createAccount.pending, (state) => {
        state.createStatus = 'loading';
        state.error = null;
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.items.push(action.payload); // Tambahkan akun baru ke array
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload?.message || 'Failed to create account';
      });
  }
});

export const { clearError, resetCreateStatus } = accountsSlice.actions;
export default accountsSlice.reducer;