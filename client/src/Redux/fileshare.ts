import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

interface SharedFile {
  name: string;
  url: string;
}

interface FileShareState {
  isSharing: boolean;
  isShared: boolean;
  shareUrl: string;
  error: string | null;
  sharedFiles: { [key: string]: SharedFile };
}

// Initial state
const initialState: FileShareState = {
  isSharing: false,
  isShared: false,
  shareUrl: "",
  error: null,
  sharedFiles: {},
};

const fileShareSlice = createSlice({
  name: "fileShare",
  initialState,
  reducers: {
    shareFileRequest: (state, action: PayloadAction<boolean>) => {
      state.isSharing = action.payload;
      state.isShared = false;
      state.error = null;
      if (state.isSharing) {
        toast.loading("Sharing ...");
      } else {
        toast.dismiss();
      }
    },
    shareFileSuccess: (state, action) => {
      state.isSharing = false;
      state.isShared = true;
      state.shareUrl = action.payload;
      state.error = null;
    },
    shareFileFailure: (state, action) => {
      state.isSharing = false;
      state.isShared = false;
      state.error = action.payload;
    },
    copyToClipboard: (state, action) => {
      console.log("action.payload", action.payload);
      navigator.clipboard.writeText(action.payload);
      toast.success("Link copied to clipboard!");
    },
  },
});

export const {
  shareFileRequest,
  shareFileSuccess,
  shareFileFailure,
  copyToClipboard,
} = fileShareSlice.actions;
export const fileShareReducer = fileShareSlice.reducer;
