import {
  deleteShareData,
  editSharePermissions,
  getAllUsers,
  getSharedData,
  isLoading,
  shareWithUser,
} from "./inviteUser";
import {
  deleteSharedDataApi,
  editSharePermissionApi,
  getAllUsersApi,
  getSharedDataApi,
  shareWithUserApi,
} from "../../api/inviteuserapi";
import { AppDispatch } from "../store";

export const inviteUserAsync =
  (data: { username: string; folderPath: string }) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(isLoading(true));
      const response = await shareWithUserApi(data.username, data.folderPath);
      dispatch(shareWithUser(response));
      dispatch(isLoading(false));
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
      dispatch(isLoading(true));

      const response = await getSharedDataApi(username, path);
      dispatch(getSharedData(response));
      dispatch(isLoading(false));
      return response;
    } catch (error: any) {
      throw new Error(
        "Error while getting data" +
          (error.response?.data?.message || error.message)
      );
    }
  };

export const deleteSharedDataAsync =
  (id: string, username?: string) =>
  async (dispatch: AppDispatch): Promise<void> => {
    try {
      dispatch(isLoading(true));
      const response = await deleteSharedDataApi(id, username);
      if (!response || response.error) {
        throw new Error(response?.error || "Unknown error occurred");
      }

      dispatch(deleteShareData(response));
      dispatch(isLoading(false));
    } catch (error: any) {
      console.error("Error while deleting shared data:", error);
      throw new Error(
        `Error while deleting data: ${
          error.response?.data?.message || error.message || "Unexpected error"
        }`
      );
    }
  };

export const updateSharePermissionAsync =
  (shareId: number, permission: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(isLoading(true));
      const response = await editSharePermissionApi(shareId, permission);
      dispatch(editSharePermissions(response));
      dispatch(isLoading(false));
      return response;
    } catch (error: any) {
      throw new Error(
        "Error updating share: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

export const getAllUsersAsync = () => async (dispatch: AppDispatch) => {
  try {
    const response = await getAllUsersApi();
    if (response) {
      dispatch(getAllUsers(response));
    }
  } catch (error: any) {
    throw new Error(
      "Error getting all users: " +
        (error.response?.data?.message || error.message)
    );
  }
};
