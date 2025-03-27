import axios from "axios";

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/file`;

//
export const uploadFileApi = async (
  file: File,
  folderName?: string,
  subFolderPath?: string,
  fileName?: string
) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    if (folderName) formData.append("folderName", folderName);
    if (subFolderPath) formData.append("subFolderPath", subFolderPath);
    if (fileName) formData.append("fileName", fileName);

    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: process.env.REACT_APP_ACCESS_TOKEN,
      },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(
      "Error uploading file: " +
        (error.response?.data?.message || error.message)
    );
  }
};

export const downloadFileApi = async (filePath: string) => {
  try {
    const response = await axios.get(`${API_URL}/download`, {
      params: { filePath },
      responseType: "json",
      headers: {
        Authorization: process.env.REACT_APP_ACCESS_TOKEN,
      },
    });

    // Ensure the response contains expected buffer data
    if (
      !response.data.success ||
      !response.data.result ||
      !response.data.result.uri
    ) {
      throw new Error("Invalid response format from API");
    }
    const { uri } = response.data.result;
    //download file from the uri

    const url = uri.href; // Replace with your file URL
    const link = document.createElement("a");
    link.href = url;
    link.download = ""; // This will download the file with its original name from the URL

    // Trigger the download by clicking the link programmatically
    link.click();

    return { success: true, message: "File downloaded successfully" };
  } catch (error: any) {
    console.error("Download Error:", error);
    throw new Error(
      "Error downloading file: " +
        (error.response?.data?.message || error.message)
    );
  }
};

export const deleteFileApi = async (filePath: string) => {
  try {
    const response = await axios.delete(`${API_URL}/delete`, {
      params: { filePath },
      headers: {
        Authorization: process.env.REACT_APP_ACCESS_TOKEN,
      },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(
      "Error deleting file: " + (error.response?.data?.message || error.message)
    );
  }
};

export const copyFileApi = async (
  sourcePath: string,
  destinationPath: string
) => {
  const requestBody = { sourcePath, destinationPath };
  try {
    const response = await axios.put(`${API_URL}/copy`, requestBody, {
      headers: {
        Authorization: process.env.REACT_APP_ACCESS_TOKEN,
      },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(
      "Error copying file: " + (error.response?.data?.message || error.message)
    );
  }
};

export const renameFileApi = async (filePath: string, newFileName: string) => {
  const requestBody = { filePath, newFileName };
  try {
    const response = await axios.put(`${API_URL}/rename`, requestBody, {
      headers: {
        Authorization: process.env.REACT_APP_ACCESS_TOKEN,
      },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(
      "Error renaming file: " + (error.response?.data?.message || error.message)
    );
  }
};

export const filePreviewApi = async (filePath: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/preview?filePath=${filePath}`,
      {
        headers: {
          Authorization: process.env.REACT_APP_ACCESS_TOKEN,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      "Error previewing file: " +
        (error.response?.data?.message || error.message)
    );
  }
};
