import { createSlice } from "@reduxjs/toolkit";
import { TausiUser } from "@/models/user";
import { ACCESS_TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from "@/Utils/constants";

const initialState: {
  user: TausiUser | null;
  accessToken: string | null;
  refreshToken: string | null;
} = {
  user: null,
  accessToken: null,
  refreshToken: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: { payload: { user: TausiUser; accessToken: string, refreshToken: string } }) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, action.payload.accessToken);
      localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, action.payload.refreshToken);
    },
    signOutUser: (state) => {
      state.user = null;
      state.accessToken = null;
      localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    },
    clearLocalState: (_state) => {
      localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
      localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    }
  },
});

export const { setUser, signOutUser, clearLocalState } = userSlice.actions;

export default userSlice.reducer;
