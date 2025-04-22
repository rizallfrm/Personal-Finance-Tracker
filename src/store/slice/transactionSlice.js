import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/src/lib/axios';

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (params, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get('/transactions', {
        params,
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

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: {
    items: [],
    loading: false,
    error: null,
    pagination: {}
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch transactions';
      });
  }
});

export const { clearError } = transactionsSlice.actions;
export default transactionsSlice.reducer;