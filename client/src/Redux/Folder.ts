import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

// Define the types for files and folders
interface File {
  name?: string;
  path?: string;
}

interface Folder {
  name: string;
  path?: string;
  contents: any;
  files?: File[];
}

interface FolderState {
  folders: Folder[];
  files: File[];
  loading: boolean;
  error: string | null;
  folderRename: boolean;
}

const initialState: FolderState = {
  folders: [],
  files: [],
  loading: false,
  error: null,
  folderRename: false,
};

export const folderSlice = createSlice({
  name: "folders",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
      if (state.loading) {
        toast.loading("Processing...");
      } else {
        toast.dismiss();
      }
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      if (action.payload) {
        toast.error(action.payload);
      }
    },
    setFolders: (
      state,
      action: PayloadAction<{ files: File[]; folders: Folder[] }>
    ) => {
      state.files = action.payload.files;
      state.folders = action.payload.folders;
    },
    addFolder: (
      state,
      action: PayloadAction<{ name: string; path: string }>
    ) => {
      state.folders.push({ ...action.payload, contents: [] });
      toast.success(`Folder "${action.payload.name}" added!`);
    },
    removeFolder: (state, action: PayloadAction<string>) => {
      state.folders = state.folders.filter(
        (folder) => folder.name !== action.payload
      );
      toast.success(`Folder removed!`);
    },
    downloadFolderStart(state, action) {
      state.loading = action.payload;
      if (state.loading) {
        toast.loading("Downloading file...");
      } else {
        toast.dismiss();
      }
      state.error = null;
    },
    downloadFolderSuccess(state) {
      state.loading = false;
    },
    downloadFolderFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    renameFolder(state) {
      state.loading = false;
      state.folderRename = true;
      toast.success(`Folder renamed !`);
    },
  },
});

export const {
  setLoading,
  setError,
  setFolders,
  addFolder,
  removeFolder,
  downloadFolderStart,
  downloadFolderSuccess,
  downloadFolderFailure,
  renameFolder,
} = folderSlice.actions;
export const folderReducer = folderSlice.reducer;
