import { createSlice } from '@reduxjs/toolkit';
import { TausiUser } from "@/models/user";

const initialState: TausiUser = {
  id: '',
  name: '',
  email: '',
  bio: '',
  phoneNumber: '',
  createdAt: new Date(),
  deactivatedAt: null,
  deactivatedBy: null,
  deactivatedReason: null,
  deletedAt: null,
  deletedReason: null,
  emailVerified: false,
  fcmToken: null,
  isActive: false,
  isDeleted: false,
  latitude: "",
  locationAddress: "",
  longitude: "",
  phoneVerified: false,
  profilePicturePath: null,
  profilePictureUrl: null,
  updatedAt: new Date(),
  sessionData: {
    userTypeSession: 'client',
    id: 0,
    userId: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    isDeleted: false
  }
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser : (state, action: { payload: TausiUser }) => {
      state = action.payload;

    },
    signOutUser: (state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      state = {
        ...initialState
      }
    }
  }
});

export const {
  setUser,
  signOutUser
} = userSlice.actions;


export default userSlice.reducer;
