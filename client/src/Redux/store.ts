import { configureStore } from "@reduxjs/toolkit";
import { folderReducer } from "./Folder";
import { useDispatch, useSelector } from "react-redux";
import { fileReducer } from "./files";
import { fileShareReducer } from "./fileshare";
import { folderShareReducer } from "./foldershare";
import { inviteUserReducer } from "./InviteUser/inviteUser";

const store = configureStore({
  reducer: {
    folders: folderReducer,
    file: fileReducer,
    fileShare: fileShareReducer,
    folderShare: folderShareReducer,
    inviteUser: inviteUserReducer,
  },
});

export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <TSelected>(
  selector: (state: RootState) => TSelected
) => useSelector(selector);
