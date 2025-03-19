import { createSlice } from "@reduxjs/toolkit";

const inviteUser = createSlice({
  name: "inviteUser",
  initialState: {
    sharedFolders: [] as any[], // or the appropriate type instead of string
    users: [] as string[],
  },
  reducers: {
    shareWithUser: (state, action) => {
      state.sharedFolders = [...state.sharedFolders, action.payload.result];
    },
    getSharedData: (state, action) => {
      state.sharedFolders = action.payload.result;
    },
    deleteShareData: (state, action) => {
      state.sharedFolders = state.sharedFolders.filter(
        (folder) => folder.id != action.payload.result
      );
    },
    editSharePermissions: (state, actions) => {
      state.sharedFolders = state.sharedFolders.map((folder) => {
        if (folder.id === actions.payload.result.id) {
          return actions.payload.result;
        }
        return folder;
      });
    },
    getAllUsers: (state, action) => {
      state.users = action.payload.result;
    },
  },
});
export const {
  shareWithUser,
  getSharedData,
  deleteShareData,
  editSharePermissions,
  getAllUsers,
} = inviteUser.actions;
export const inviteUserReducer = inviteUser.reducer;
