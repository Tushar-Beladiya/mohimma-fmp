import { createSlice } from "@reduxjs/toolkit";

const inviteUser = createSlice({
  name: "inviteUser",
  initialState: {
    sharedFolders: [] as string[], // or the appropriate type instead of string
  },
  reducers: {
    shareWithUser: (state, action) => {
      state.sharedFolders = [...state.sharedFolders, action.payload.result];
    },
    getSharedData: (state, action) => {
      state.sharedFolders = action.payload.result;
    },
  },
});
export const { shareWithUser, getSharedData } = inviteUser.actions;
export const inviteUserReducer = inviteUser.reducer;
