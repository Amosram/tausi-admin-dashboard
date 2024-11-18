import { fetchAppointmentById, fetchAppointments } from "@/modules/orders/api";
import { Appointment, OrdersTableData } from "@/modules/orders/types";
import { transformToTableData } from "@/modules/orders/utils/transform-orders-data";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

interface OrdersState {
  data: OrdersTableData[];
  currentOrder: Appointment | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  isInitialized: boolean;
}

const initialState: OrdersState = {
  data: [],
  currentOrder: null,
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

export const fetchOrderDetails = createAsyncThunk(
  "orders/fetchOrderDetails",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const appointment = await fetchAppointmentById(orderId);
      return appointment;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch order details.");
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
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
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
      })
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
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

export const { setInitialized, clearCurrentOrder } = ordersSlice.actions;
export default persistReducer(ordersPersistConfig, ordersSlice.reducer);
