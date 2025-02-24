import {
  uploadFileStart,
  uploadFileSuccess,
  uploadFileFailure,
  downloadFileStart,
  downloadFileSuccess,
  downloadFileFailure,
} from "./files";
import { downloadFileApi, uploadFileApi } from "../api/fileapi";
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
      console.log("response", response);

      dispatch(uploadFileSuccess(response));
      console.log("response", response);
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
