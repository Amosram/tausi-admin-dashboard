import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AppearanceState {
  theme: "light" | "dark" | "system";
  sidebarColor: string;
  primaryColor: string;
  secondaryColor: string;
  font: string;
  density: number;
  useCustomTheme: boolean;
}

const initialState: AppearanceState = {
  theme: "light",
  sidebarColor: "default",
  primaryColor: "#1264A3",
  secondaryColor: "#2EB67D",
  font: "Lato",
  density: 1,
  useCustomTheme: false,
};

const appearanceSlice = createSlice({
  name: "appearance",
  initialState,
  reducers: {
    setAppearanceSettings(state, action: PayloadAction<AppearanceState>) {
      return { ...state, ...action.payload };
    },
    toggleCustomTheme(state, action: PayloadAction<boolean>) {
      state.useCustomTheme = action.payload;
    },
  },
});

export const { setAppearanceSettings, toggleCustomTheme } = appearanceSlice.actions;
export default appearanceSlice.reducer;
