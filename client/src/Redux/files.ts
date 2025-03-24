import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

// type FolderState = ReturnType<typeof folderSlice.getInitialState>;
interface File {
  name?: string;
  path?: string;
}
interface FileState {
  uploadFileLoading: boolean;
  downloadFileLoading: {};
  uploaded: boolean;
  fileUploadPath: string;
  error: string | null;
  files: File[];
}

const initialState: FileState = {
  uploadFileLoading: false,
  downloadFileLoading: {},
  uploaded: false,
  fileUploadPath: "",
  error: null,
  files: [],
};

const file = createSlice({
  name: "files",
  initialState,
  reducers: {
    setFileLoading: (state, action) => {
      state.uploadFileLoading = action.payload;
      if (state.uploadFileLoading === true) {
        toast.loading("loading...");
      } else {
        toast.dismiss();
      }
    },
    setFiles: (state, action) => {
      state.files = action.payload;
    },
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

      state.files = [...state.files, { ...action.payload.result }];
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
      state.files = state.files.filter((file) => file.path !== action.payload);
      toast.success(`File deleted!`);
    },
    copyFile(state, action: PayloadAction<{ result: File }>) {
      state.files.push(action.payload.result);
      toast.success(`File copied!`);
    },
    renameFile(state, action) {
      const idx = state.files.findIndex(
        (folder) => folder.name === action.payload.result.oldFileName
      );
      state.files[idx].name = action.payload.result.newFileName;
      state.files[idx].path = action.payload.result.path;
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
  setFiles,
  setFileLoading,
} = file.actions;
export const fileReducer = file.reducer;
