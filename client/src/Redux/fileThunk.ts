import {
  uploadFileStart,
  uploadFileSuccess,
  uploadFileFailure,
  downloadFileStart,
  downloadFileSuccess,
  downloadFileFailure,
  removeFile,
  copyFile,
  renameFile,
} from "./files";
import {
  copyFileApi,
  deleteFileApi,
  downloadFileApi,
  renameFileApi,
  uploadFileApi,
} from "../api/fileapi";
import { AppDispatch } from "./store";

export const uploadFileAsync =
  (
    file: File,
    folderName?: string,
    subFolderPath?: string,
    fileName?: string
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(uploadFileStart(true));

      const response = await uploadFileApi(
        file,
        folderName,
        subFolderPath,
        fileName
      );

      dispatch(uploadFileSuccess(response));
    } catch (error: any) {
      dispatch(uploadFileFailure(error.message));
    } finally {
      dispatch(uploadFileStart(false));
    }
  };

export const downloadFileAsync =
  (filePath: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(downloadFileStart(filePath));
      await downloadFileApi(filePath);
      dispatch(downloadFileSuccess());
    } catch (error: any) {
      dispatch(downloadFileFailure(error.message));
    } finally {
      dispatch(downloadFileStart(false));
    }
  };

export const deleteFileAsync =
  (filePath: string) => async (dispatch: AppDispatch) => {
    try {
      await deleteFileApi(filePath);

      dispatch(removeFile(filePath));
    } catch (error: any) {
      console.error("Error removing file:", error.message);
    }
  };

export const copyFileAsync =
  (sourcePath: string, destinationPath: string) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await copyFileApi(sourcePath, destinationPath);
      dispatch(copyFile(response));
    } catch (error: any) {
      console.error("Error copying file:", error.message);
    }
  };

export const renameFileAsync =
  (filePath: string, newFileName: string) => async (dispatch: AppDispatch) => {
    try {
      const response = await renameFileApi(filePath, newFileName);

      dispatch(renameFile(response));
    } catch (error: any) {
      console.error("Error renaming file:", error.message);
    }
  };
