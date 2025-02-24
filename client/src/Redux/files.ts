import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { act } from "react";
import toast from "react-hot-toast";

interface FileState {
  uploadFileLoading: boolean;
  downloadFileLoading: {};
  uploaded: boolean;
  fileUploadPath: string;
  error: string | null;
}

const initialState: FileState = {
  uploadFileLoading: false,
  downloadFileLoading: {},
  uploaded: false,
  fileUploadPath: "",
  error: null,
};

const file = createSlice({
  name: "files",
  initialState,
  reducers: {
    uploadFileStart: (state, action: PayloadAction<boolean>) => {
      console.log("action.payload from file", action.payload);

      state.uploadFileLoading = action.payload;
      state.error = null;
      if (state.uploadFileLoading) {
        toast.loading("Uploading file...");
      } else {
        toast.dismiss();
      }
    },
    uploadFileSuccess: (state, action: PayloadAction<{ result: string }>) => {
      state.uploadFileLoading = false;
      state.uploaded = true;
      console.log("action.payload.result", action);
      state.fileUploadPath = action.payload.result;
    },
    uploadFileFailure: (state, action: PayloadAction<string>) => {
      state.uploadFileLoading = false;
      state.error = action.payload;
    },
    downloadFileStart(state, action) {
      state.downloadFileLoading = action.payload;
      if (state.downloadFileLoading) {
        toast.loading("Downloading file...");
      } else {
        toast.dismiss();
      }
      state.error = null;
    },
    downloadFileSuccess(state) {
      state.downloadFileLoading = {};
    },
    downloadFileFailure(state, action) {
      state.downloadFileLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  uploadFileStart,
  uploadFileSuccess,
  uploadFileFailure,
  downloadFileFailure,
  downloadFileSuccess,
  downloadFileStart,
} = file.actions;
export const fileReducer = file.reducer;
