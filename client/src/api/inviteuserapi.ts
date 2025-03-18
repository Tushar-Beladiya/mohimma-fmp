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
