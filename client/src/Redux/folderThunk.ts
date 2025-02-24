import {
  createFolderApi,
  deleteFolderApi,
  getFoldersApi,
} from "../api/folderapi";

import { AppDispatch } from "./store";
import {
  setLoading,
  setError,
  setFolders,
  addFolder,
  removeFolder,
} from "./Folder";

export const getFoldersAsync =
  ({ name, subFolderPath }: { name?: string; subFolderPath?: string } = {}) =>
  async (dispatch: AppDispatch) => {
    try {
      // dispatch(setLoading(true));

      const response = await getFoldersApi({ name, subFolderPath });

      if (response && response.result && response.result.contents) {
        const { files, folders } = response.result.contents;
        dispatch(setFolders({ files, folders }));
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error: any) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const createFolderAsync =
  (folderName: string, subFolderPath?: string) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const newFolder = await createFolderApi(folderName, subFolderPath || "");

      if (newFolder && newFolder.result && newFolder.result.memento) {
        const folderName = newFolder.result.memento.baseName;
        const folderPath = newFolder.result.memento.name;
        dispatch(addFolder({ name: folderName, path: folderPath }));
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error: any) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const deleteFolderAsync =
  (folderName: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));

      // Call the API to delete the folder
      const response = await deleteFolderApi(folderName);

      if (response) {
        dispatch(removeFolder(folderName));
      } else {
        throw new Error("Failed to delete folder. No response received.");
      }
    } catch (error: any) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };
