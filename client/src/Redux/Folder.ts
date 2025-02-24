// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import toast from "react-hot-toast";

// // Define the types for files and folders
// interface File {
//   name?: string;
//   path?: string;
// }

// interface Folder {
//   name: string;
//   path?: string;
//   contents: any;
//   files?: File[];
// }

// interface FolderState {
//   folders: Folder[];
//   files: File[];
//   loading: boolean;
//   error: string | null;
// }

// const initialState: FolderState = {
//   folders: [],
//   files: [],
//   loading: false,
//   error: null,
// };

// export const folderSlice = createSlice({
//   name: "folders",
//   initialState,
//   reducers: {
//     setLoading: (state, action: PayloadAction<boolean>) => {
//       state.loading = action.payload;
//     },
//     setError: (state, action: PayloadAction<string | null>) => {
//       state.error = action.payload;
//     },
//     setFolders: (
//       state,
//       action: PayloadAction<{ files: File[]; folders: Folder[] }>
//     ) => {
//       console.log("all folders", action.payload.folders);

//       state.files = action.payload.files;
//       state.folders = action.payload.folders;
//     },
//     addFolder: (
//       state,
//       action: PayloadAction<{ name: string; path: string }>
//     ) => {
//       state.folders.push({ ...action.payload, contents: [] });
//     },
//     removeFolder: (state, action: PayloadAction<string>) => {
//       state.folders = state.folders.filter(
//         (folder) => folder.name !== action.payload
//       );
//     },
//   },
// });

// export const { setLoading, setError, setFolders, addFolder, removeFolder } =
//   folderSlice.actions;
// export const folderReducer = folderSlice.reducer;

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
}

const initialState: FolderState = {
  folders: [],
  files: [],
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
    setFolders: (
      state,
      action: PayloadAction<{ files: File[]; folders: Folder[] }>
    ) => {
      console.log("all folders", action.payload.folders);
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
      toast.success(`Folder "${action.payload}" removed!`);
    },
  },
});

export const { setLoading, setError, setFolders, addFolder, removeFolder } =
  folderSlice.actions;
export const folderReducer = folderSlice.reducer;
