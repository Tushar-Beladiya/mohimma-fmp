// api/folderApi.ts
import axios from "axios";

const API_URL = "http://localhost:8001/api/folder";

export const createFolderApi = async (
  folderName: string,
  subFolderPath?: string
) => {
  try {
    const requestBody = { folderName, subFolderPath };
    console.log("Sending request with body:", requestBody);

    const response = await axios.post(API_URL, requestBody);
    return response.data;
  } catch (error: any) {
    // Handle error
    throw new Error(
      "Error creating folder: " +
        (error.response?.data?.message || error.message)
    );
  }
};

export const getFoldersApi = async ({
  name,
  subFolderPath,
}: {
  name?: string;
  subFolderPath?: string;
}) => {
  try {
    if (name !== undefined && subFolderPath !== null) {
      const response = await axios.get(
        `${API_URL}?folderPath=${name}&subFolderPath=${subFolderPath}`
      );
      return response.data;
    } else {
      const response = await axios.get(`${API_URL}`);
      return response.data;
    }
  } catch (error: any) {
    throw new Error(
      "Error getting folders: " +
        (error.response?.data?.message || error.message)
    );
  }
};

export const deleteFolderApi = async (name: string) => {
  try {
    const response = await axios.delete(`${API_URL}?folderName=${name}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      "Error deleting folder: " +
        (error.response?.data?.message || error.message)
    );
  }
};
