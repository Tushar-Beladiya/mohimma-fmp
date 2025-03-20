import axios from "axios";

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/inviteuser`;

export const shareWithUserApi = async (username: string, path: string) => {
  try {
    console.log("calling....", username, path);

    const response = await axios.get(
      `${API_URL}?username=${username}&folderPath=${path}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      "Error deleting file: " + (error.response?.data?.message || error.message)
    );
  }
};

export const getSharedDataApi = async (username?: string, path?: string) => {
  try {
    console.log("calling....", username, path);

    const response = await axios.get(`${API_URL}/shared`, {
      params: { username, path },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      "Error getting shared data: " +
        (error.response?.data?.message || error.message)
    );
  }
};

export const deleteSharedDataApi = async (
  id: string | number,
  username?: string
) => {
  try {
    const response = await axios.delete(`${API_URL}`, {
      params: { shareId: id, shareWith: username },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(
      "Error deleting shared data: " +
        (error.response?.data?.message || error.message)
    );
  }
};

export const editSharePermissionApi = async (
  shareId: number,
  permission: number
) => {
  try {
    const response = await axios.put(`${API_URL}`, {
      shareId,
      permission,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      "Error updating permission: " +
        (error.response?.data?.message || error.message)
    );
  }
};

export const getAllUsersApi = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      "Error getting all users: " +
        (error.response?.data?.message || error.message)
    );
  }
};
