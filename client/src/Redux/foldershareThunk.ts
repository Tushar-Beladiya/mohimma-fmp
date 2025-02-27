import { shareFolderApi, shareFolderAsPrivateApi } from "../api/foldershareapi";
import {
  copyToClipboard,
  shareFolderFailure,
  shareFolderRequest,
  shareFolderSuccess,
} from "./foldershare";

import { AppDispatch } from "./store";

export const shareFolder =
  (folderPath: string, publicAccess: boolean = false) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(shareFolderRequest(true));

      const response = await shareFolderApi(folderPath, publicAccess);

      dispatch(shareFolderSuccess(response.result));
      dispatch(copyToClipboard(response.result));
    } catch (error: any) {
      dispatch(shareFolderFailure(error));
    } finally {
      dispatch(shareFolderRequest(false));
    }
  };

export const shareFolderAsPrivate =
  (folderPath: string, password: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(shareFolderRequest(true));
      const response = await shareFolderAsPrivateApi(folderPath, password);

      dispatch(shareFolderSuccess(response.result));
      dispatch(copyToClipboard(response.result));
    } catch (error: any) {
      dispatch(shareFolderFailure(error));
    } finally {
      dispatch(shareFolderRequest(false));
    }
  };
