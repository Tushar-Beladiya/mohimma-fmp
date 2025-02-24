import { shareFileApi } from "../api/fileshareapi";
import {
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

      dispatch(shareFileSuccess(response.result)); // Assuming `result` contains the shared URL
    } catch (error: any) {
      dispatch(shareFileFailure(error));
    } finally {
      dispatch(shareFileRequest(false));
    }
  };
