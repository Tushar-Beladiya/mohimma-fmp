import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { folderSlice } from "./Folder";

type FolderState = ReturnType<typeof folderSlice.getInitialState>;
interface FileState {
  uploadFileLoading: boolean;
  downloadFileLoading: {};
  uploaded: boolean;
  fileUploadPath: string;
  error: string | null;
  files: FolderState["files"];
}

const initialState: FileState = {
  uploadFileLoading: false,
  downloadFileLoading: {},
  uploaded: false,
  fileUploadPath: "",
  error: null,
  files: folderSlice.getInitialState().files,
};

const file = createSlice({
  name: "files",
  initialState,
  reducers: {
    uploadFileStart: (state, action: PayloadAction<boolean>) => {
      state.uploadFileLoading = action.payload;
      state.error = null;
      if (state.uploadFileLoading) {
        toast.loading("Uploading file...");
      } else {
        toast.dismiss();
      }
    },
    uploadFileSuccess: (state, action: PayloadAction<{ result: File }>) => {
      state.uploadFileLoading = false;
      state.uploaded = true;
      state.files.push(action.payload.result);
    },
    uploadFileFailure: (state, action: PayloadAction<string>) => {
      state.uploadFileLoading = false;
      state.error = action.payload;
    },
    downloadFileStart(state, action) {
      state.downloadFileLoading = action.payload;
      if (state.downloadFileLoading) {
        toast.loading("Downloading ...");
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
    removeFile(state, action) {
      state.files = state.files.filter((file) => file.name !== action.payload);
      toast.success(`File deleted!`);
    },
    copyFile(state, action: PayloadAction<{ result: File }>) {
      state.files.push(action.payload.result);

      toast.success(`File copied!`);
    },
    renameFile(state, action) {
      state.files = state.files.map((file) => {
        if (file.name === action.payload.oldName) {
          file.name = action.payload.newName;
        }
        return file;
      });
      toast.success(`File renamed!`);
    },
    previewFailure(state, action) {
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
  removeFile,
  copyFile,
  renameFile,
  previewFailure,
} = file.actions;
export const fileReducer = file.reducer;
