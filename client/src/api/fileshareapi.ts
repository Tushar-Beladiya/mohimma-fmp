import axios from "axios";

const API_URL = "http://localhost:8001/api/fileshare";

/**
 * Shares a file publicly.
 *
 * @param {string} filePath - The path of the file to be shared.
 * @param {boolean} [publicAccess=false] - Optional flag to allow public access.
 * @returns {Promise<Object>} - Response data from the API.
 * @throws {Error} - Throws an error if the request fails.
 */
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
