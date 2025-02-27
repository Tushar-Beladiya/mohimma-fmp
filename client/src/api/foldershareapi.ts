import axios from "axios";

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/folderShare`;

export const shareFolderApi = async (
  folderPath: string,
  publicAccess: boolean = false
) => {
  try {
    const params = { folderPath, publicAccess: false };

    if (publicAccess) {
      params.publicAccess = true;
    }

    const response = await axios.get(`${API_URL}/public`, { params });

    return response.data;
  } catch (error: any) {
    throw new Error(
      "Error sharing file: " + (error.response?.data?.message || error.message)
    );
  }
};

export const shareFolderAsPrivateApi = async (
  folderPath: string,
  password: string
) => {
  try {
    const response = await axios.get(`${API_URL}/private`, {
      params: { folderPath, password },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};
