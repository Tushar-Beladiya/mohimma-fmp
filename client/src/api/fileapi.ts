import axios from "axios";
import { createClient, FileStat } from "webdav";

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
    });

    // Ensure the response contains expected buffer data
    if (
      !response.data.success ||
      !response.data.result ||
      !response.data.result.data
    ) {
      throw new Error("Invalid response format from API");
    }

    // Convert Buffer data (array of numbers) to a Uint8Array
    const bufferData = new Uint8Array(response.data.result.data);

    // Create a Blob from the Uint8Array
    const blob = new Blob([bufferData], { type: "application/octet-stream" });

    // Extract filename from the API response or fallback to a default
    let fileName = filePath.split("/").pop() || "downloaded_file";
    const contentDisposition = response.headers?.["content-disposition"];
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+)"/);
      if (match && match[1]) {
        fileName = match[1];
      }
    }

    // Create a download link and trigger download
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

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
    const response = await axios.put(`${API_URL}/copy`, requestBody);

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
    const response = await axios.put(`${API_URL}/rename`, requestBody);

    return response.data;
  } catch (error: any) {
    throw new Error(
      "Error renaming file: " + (error.response?.data?.message || error.message)
    );
  }
};

export const filePreviewApi = async (filePath: string) => {
  try {
    const response = await axios.get(`${API_URL}/preview?filePath=${filePath}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      "Error previewing file: " +
        (error.response?.data?.message || error.message)
    );
  }
};
