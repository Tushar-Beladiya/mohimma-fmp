import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

// Define the types for folders

interface Folder {
  name: string;
  path?: string;
  contents: any;
}

interface FolderState {
  folders: Folder[];
  loading: boolean;
  error: string | null;
}

const initialState: FolderState = {
  folders: [],
  loading: false,
  error: null,
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
    setFolders: (state, action: PayloadAction<{ folders: Folder[] }>) => {
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
        toast.loading("Downloading folder...");
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
    renameFolder(state, action) {
      state.loading = false;
      const idx = state.folders.findIndex(
        (folder) => folder.name === action.payload.result.oldFolderName
      );
      state.folders[idx].name = action.payload.result.newFolderName;
      state.folders[idx].path = action.payload.result.path;
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
