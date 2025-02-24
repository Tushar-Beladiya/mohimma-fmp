import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stat } from "fs";
import toast from "react-hot-toast";

interface SharedFile {
  name: string; // Store file name in Redux
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
  sharedFiles: {}, // Empty initially
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
        toast.loading("Sharing file...");
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
    setFileName: (state, action) => {
      const { filePath, fileName } = action.payload;
      console.log("Setting file name", fileName, "for", filePath);

      if (!state.sharedFiles[filePath]) {
        console.log("path", state.sharedFiles[filePath]);

        state.sharedFiles[filePath] = { name: fileName, url: state.shareUrl };
      }
    },
  },
});

export const {
  shareFileRequest,
  shareFileSuccess,
  shareFileFailure,
  setFileName,
} = fileShareSlice.actions;
export const fileShareReducer = fileShareSlice.reducer;
