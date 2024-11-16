import { fetchAppointments } from "@/modules/orders/api";
import { OrdersTableData } from "@/modules/orders/types";
import { transformToTableData } from "@/modules/orders/utils/transform-orders-data";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

interface OrdersState {
  data: OrdersTableData[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  isInitialized: boolean;
}

const initialState: OrdersState = {
  data: [],
  loading: false,
  error: null,
  lastUpdated: null,
  isInitialized: false,
};

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (limit: number, { rejectWithValue }) => {
    try {
      const appointments = await fetchAppointments(limit);
      return transformToTableData(appointments);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch orders.");
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setInitialized: (state) => {
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastUpdated = new Date().toLocaleString();
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

const ordersPersistConfig = {
  key: "orders",
  storage,
  version: 1,
  blacklist: ["loading", "error"],
};

export const { setInitialized } = ordersSlice.actions;
export default persistReducer(ordersPersistConfig, ordersSlice.reducer);
