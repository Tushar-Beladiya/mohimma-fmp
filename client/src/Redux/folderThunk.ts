import {
  createFolderApi,
  deleteFolderApi,
  downloadFolderApi,
  getFoldersApi,
  renameFolderApi,
} from "../api/folderapi";

import { saveAs } from "file-saver";
import JSZip from "jszip";
import { downloadFileFailure, setFiles } from "./files";
import {
  addFolder,
  downloadFolderStart,
  downloadFolderSuccess,
  removeFolder,
  renameFolder,
  setError,
  setFolders,
  setLoading,
} from "./Folder";
import { AppDispatch } from "./store";

export const getFoldersAsync =
  ({ name, subFolderPath }: { name?: string; subFolderPath?: string } = {}) =>
  async (dispatch: AppDispatch) => {
    try {
      // dispatch(setLoading(true));

      const response = await getFoldersApi({ name, subFolderPath });

      if (response && response.result && response.result.contents) {
        const { files, folders } = response.result.contents;
        dispatch(setFolders({ folders }));
        dispatch(setFiles(files));
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

      if (newFolder && newFolder.result) {
        const folderName = newFolder.result.baseName;
        const folderPath = newFolder.result.name;
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
  (folderName: string, subFolderPath?: string) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));

      const response = await deleteFolderApi(folderName, subFolderPath);

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

export const downloadFolderAsync =
  (folderPath: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(downloadFolderStart(true));
      const data = await downloadFolderApi(folderPath);
      const result = data.result || {};
      const zip = new JSZip();
      const pathParts = folderPath.split("/").filter(Boolean);
      const baseFolder = pathParts[pathParts.length - 1];

      for (const [filePath, base64Content] of Object.entries(result)) {
        try {
          if (typeof base64Content !== "string") continue;

          const cleanedBase64 = base64Content
            .replace(/-/g, "+")
            .replace(/_/g, "/")
            .replace(/\s/g, "");

          try {
            const fileData = Uint8Array.from(atob(cleanedBase64), (c) =>
              c.charCodeAt(0)
            );
            const baseIndex = filePath.lastIndexOf("/" + baseFolder + "/");
            let relativePath =
              baseIndex !== -1
                ? filePath.substring(baseIndex + baseFolder.length + 1)
                : filePath.split("/").pop() || filePath;

            zip.file(relativePath, fileData);
            dispatch(downloadFolderSuccess());
          } catch (decodeError) {
            console.error(`Failed to decode ${filePath}:`, decodeError);
          }
        } catch (error) {
          console.error(`Error processing file ${filePath}:`, error);
        }
      }

      if (Object.keys(zip.files).length === 0) {
        throw new Error("No files were successfully processed for the ZIP");
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, `${baseFolder}.zip`);
    } catch (error: any) {
      dispatch(downloadFileFailure(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const renameFolderAsync =
  (folderPath: string, newFolderName: string) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await renameFolderApi(folderPath, newFolderName);
      if (response) {
        dispatch(renameFolder(response));
      } else {
        throw new Error("Failed to rename folder. No response received.");
      }
    } catch (error: any) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };
