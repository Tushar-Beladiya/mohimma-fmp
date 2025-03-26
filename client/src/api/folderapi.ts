// api/folderApi.ts
import axios from "axios";

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/folder`;

export const createFolderApi = async (
  folderName: string,
  subFolderPath?: string
) => {
  try {
    const requestBody = { folderName, subFolderPath };

    const response = await axios.post(API_URL, requestBody, {
      headers: {
        Authorization: process.env.REACT_APP_ACCESS_TOKEN,
      },
    });
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
        `${API_URL}?folderPath=${name}&subFolderPath=${subFolderPath}`,
        {
          headers: {
            Authorization: process.env.REACT_APP_ACCESS_TOKEN,
          },
        }
      );
      return response.data;
    } else {
      const response = await axios.get(`${API_URL}`, {
        headers: {
          Authorization: process.env.REACT_APP_ACCESS_TOKEN,
        },
      });
      return response.data;
    }
  } catch (error: any) {
    throw new Error(
      "Error getting folders: " +
        (error.response?.data?.message || error.message)
    );
  }
};

export const deleteFolderApi = async (name: string, subFolderPath?: string) => {
  try {
    const response = await axios.delete(
      `${API_URL}?folderName=${name}&subFolderPath=${subFolderPath}`,
      {
        headers: {
          Authorization: process.env.REACT_APP_ACCESS_TOKEN,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      "Error deleting folder: " +
        (error.response?.data?.message || error.message)
    );
  }
};

export const downloadFolderApi = async (folderPath: string) => {
  try {
    const response = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/api/folder/download?folderPath=${folderPath}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.REACT_APP_ACCESS_TOKEN,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.data;
  } catch (error: any) {
    throw new Error(
      "Error downloading folder: " +
        (error.response?.data?.message || error.message)
    );
  }
};

export const renameFolderApi = async (
  folderPath: string,
  newFolderName: string
) => {
  try {
    const response = await axios.put(
      `${API_URL}/rename`,
      {
        folderPath,
        newFolderName,
      },
      {
        headers: {
          Authorization: process.env.REACT_APP_ACCESS_TOKEN,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      "Error renaming folder: " +
        (error.response?.data?.message || error.message)
    );
  }
};
