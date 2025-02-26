import axios from "axios";

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/fileshare`;

export const shareFileApi = async (
  filePath: string,
  publicAccess: boolean = false
) => {
  try {
    const params = { filePath, publicAccess: false };

    // Add publicAccess only if it's true
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

export const shareFileAsPrivateApi = async (
  filePath: string,
  password: string
) => {
  try {
    const response = await axios.get(`${API_URL}/private`, {
      params: { filePath, password },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message; // Throw only a string message
  }
};
