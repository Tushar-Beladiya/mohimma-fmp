import { getSharedData, shareWithUser } from "./inviteUser";
import { getSharedDataApi, shareWithUserApi } from "../../api/inviteuserapi";
import { AppDispatch } from "../store";

export const inviteUserAsync =
  (data: { username: string; folderPath: string }) =>
  async (dispatch: AppDispatch) => {
    try {
      console.log("call from thunk");

      const response = await shareWithUserApi(data.username, data.folderPath);
      dispatch(shareWithUser(response));
      console.log("response of share with user", response);

      return response;
    } catch (error: any) {
      throw new Error(
        "Error inviting user: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

export const getSharedDataAsync =
  (username?: string, path?: string) => async (dispatch: AppDispatch) => {
    try {
      const response = await getSharedDataApi(username, path);
      dispatch(getSharedData(response));
      console.log("response of shred item", response);
      return response;
    } catch (error: any) {
      throw new Error(
        "Error while getting data" +
          (error.response?.data?.message || error.message)
      );
    }
  };
