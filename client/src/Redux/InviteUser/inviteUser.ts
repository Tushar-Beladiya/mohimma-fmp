import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

interface OcsShare {
  id: number;
  shareType: number;
  shareTypeSystemName: string;
  ownerUserId: string;
  ownerDisplayName: string;
  permissions: number;
  permissionsText: string;
  sharedOn: Date;
  sharedOnTimestamp: number;
  parent: string;
  expiration: Date;
  token: string;
  fileOwnerUserId: string;
  fileOwnerDisplayName: string;
  note: string;
  label: string;
  path: string;
  itemType: "file" | "folder";
  mimeType: string;
  storageId: string;
  storage: number;
  fileId: number;
  parentFileId: number;
  fileTarget: string;
  sharedWith: string;
  sharedWithDisplayName: string;
  mailSend: boolean;
  hideDownload: boolean;
  password?: string;
  sendPasswordByTalk?: boolean;
  url?: string;
}

const inviteUser = createSlice({
  name: "inviteUser",
  initialState: {
    sharedFolders: [] as OcsShare[],
    users: [] as string[],
    loading: false as boolean,
  },
  reducers: {
    isLoading: (state, action) => {
      state.loading = action.payload;
      if (state.loading) {
        toast.loading("loading...");
      } else {
        toast.dismiss();
      }
    },
    shareWithUser: (state, action) => {
      if (action.payload.result.length !== 0) {
        state.sharedFolders = [
          ...state.sharedFolders,
          ...action.payload.result,
        ];
      }
      toast.success("Shared successfully");
    },
    getSharedData: (state, action) => {
      state.sharedFolders = [...action.payload.result];
      toast.success("all shared links fetched successfully");
    },
    deleteShareData: (state, action) => {
      state.sharedFolders = state.sharedFolders.filter((folder) => {
        return !action.payload.result.includes(folder.id);
      });
      toast.success("Deleted successfully");
    },
    editSharePermissions: (state, actions) => {
      state.sharedFolders = state.sharedFolders.map((folder) => {
        if (folder.id === actions.payload.result.id) {
          return actions.payload.result;
        }
        return folder;
      });
      toast.success("Permissions updated successfully");
    },
    getAllUsers: (state, action) => {
      state.users = action.payload.result;
    },
  },
});
export const {
  isLoading,
  shareWithUser,
  getSharedData,
  deleteShareData,
  editSharePermissions,
  getAllUsers,
} = inviteUser.actions;
export const inviteUserReducer = inviteUser.reducer;
