import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import toast from "react-hot-toast";

interface SharedFolder {
  name: string;
  url: string;
}

interface FolderShareState {
  isSharing: boolean;
  isShared: boolean;
  shareFolderUrl: string;
  error: string | null;
  sharedFolders: { [key: string]: SharedFolder };
}

// Initial state
const initialState: FolderShareState = {
  isSharing: false,
  isShared: false,
  shareFolderUrl: "",
  error: null,
  sharedFolders: {},
};

const folderShareSlice = createSlice({
  name: "folderShare",
  initialState,
  reducers: {
    shareFolderRequest: (state, action: PayloadAction<boolean>) => {
      state.isSharing = action.payload;
      state.isShared = false;
      state.error = null;
      if (state.isSharing) {
        toast.loading("Sharing folder...");
      } else {
        toast.dismiss();
      }
    },
    shareFolderSuccess: (state, action) => {
      state.isSharing = false;
      state.isShared = true;
      state.shareFolderUrl = action.payload;

      navigator.clipboard.writeText(action.payload);
      toast.success("Link copied to clipboard!");
      state.error = null;
    },
    shareFolderFailure: (state, action) => {
      state.isSharing = false;
      state.isShared = false;
      state.error = action.payload;
    },
    copyToClipboard: (state, action) => {
      navigator.clipboard.writeText(action.payload);
      toast.success("Link copied to clipboard!");
    },
  },
});

export const {
  shareFolderRequest,
  shareFolderSuccess,
  shareFolderFailure,
  copyToClipboard,
} = folderShareSlice.actions;
export const folderShareReducer = folderShareSlice.reducer;
