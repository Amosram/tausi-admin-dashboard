import { Coordinates } from "@/models";

export const API_URL = import.meta.env.VITE_API_URL;
export const DEFAULT_LOCATION: Coordinates = { x: -1.286389, y: 36.817223 };
export const ACCESS_TOKEN_STORAGE_KEY = "accessToken";
export const REFRESH_TOKEN_STORAGE_KEY = "refreshToken";
