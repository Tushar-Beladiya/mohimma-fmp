import { shareFileApi, shareFileAsPrivateApi } from "../api/fileshareapi";
import {
  copyToClipboard,
  shareFileFailure,
  shareFileRequest,
  shareFileSuccess,
} from "./fileshare";
import { AppDispatch } from "./store";

export const shareFile =
  (filePath: string, publicAccess: boolean = false) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(shareFileRequest(true));

      const response = await shareFileApi(filePath, publicAccess);

      dispatch(shareFileSuccess(response.result));
      dispatch(copyToClipboard(response.result));
    } catch (error: any) {
      dispatch(shareFileFailure(error));
    } finally {
      dispatch(shareFileRequest(false));
    }
  };

export const shareFileAsPrivate =
  (filePath: string, password: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(shareFileRequest(true));

      const response = await shareFileAsPrivateApi(filePath, password);

      dispatch(shareFileSuccess(response.result));
      dispatch(copyToClipboard(response.result));
    } catch (error: any) {
      dispatch(shareFileFailure(error));
    } finally {
      dispatch(shareFileRequest(false));
    }
  };
