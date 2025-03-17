import axios from 'axios';
import Client from 'nextcloud-node-client';
const client = new Client();

declare module 'nextcloud-node-client' {
  interface ICreateShare {
    shareType?: number;
    shareWith?: string;
    permissions?: number;
  }
}

export const shareFolder = async (folderPath: string, username: string) => {
  try {
    // Check if user exists
    const existingUsers = await client.getUsers();
    const userExists = existingUsers.some((user) => user.id === username);

    if (!userExists) {
      console.log(`User ${username} does not exist. Creating user...`);
      await client.createUser({ id: username, email: username });
      console.log(`User ${username} created successfully.`);
    } else {
      console.log(`User ${username} already exists.`);
    }
    const userData = await client.getUserData('ua.codespace@gmail.com');
    console.log('userdata---------------', userData);

    // Ensure the file exists
    const folder = await client.getFolder(folderPath);
    if (!folder) {
      return {
        success: false,
        message: `Folder ${folderPath} does not exist`,
      };
    } else {
      const baseUrl = process.env.NEXTCLOUD_URL;
      const auth = {
        username: `${process.env.NEXTCLOUD_USERNAME}`,
        password: `${process.env.NEXTCLOUD_PASSWORD}`,
      };

      // Prepare request parameters
      const params = new URLSearchParams();
      params.append('path', folderPath);
      params.append('shareType', '0');
      params.append('shareWith', username);
      params.append('permissions', '1');

      // Make direct OCS API call
      const response = await axios.post(`${baseUrl}/ocs/v2.php/apps/files_sharing/api/v1/shares`, params.toString(), {
        headers: {
          'OCS-APIRequest': 'true',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: auth,
      });
      return {
        success: true,
        message: 'Folder shared successfully',
        result: response.data,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to share folder',
    };
  }
};

export const getItemsSharedWithUser = async (username: string) => {
  try {
    // Check if user exists
    const existingUsers = await client.getUsers();
    const userExists = existingUsers.some((user) => user.id === username);

    if (!userExists) {
      console.log(`User ${username} does not exist.`);
      return;
    } else {
      console.log(`User ${username} already exists.`);
    }

    // Extract Nextcloud base URL and credentials from client
    const baseUrl = process.env.NEXTCLOUD_URL;
    const credentials = {
      username: process.env.NEXTCLOUD_USERNAME,
      password: process.env.NEXTCLOUD_PASSWORD,
    };

    // Create basic auth header
    const authString = `${credentials.username}:${credentials.password}`;
    const base64Auth = Buffer.from(authString).toString('base64');

    // Call the OCS API directly since there might not be a direct method in the library
    const response = await axios.get(`${baseUrl}/ocs/v2.php/apps/files_sharing/api/v1/shares`, {
      params: { format: 'json' },
      headers: {
        Authorization: `Basic ${base64Auth}`,
        'OCS-APIRequest': 'true',
        Accept: 'application/json',
      },
    });

    // Extract shares from response
    const shares = response.data.ocs.data;

    // Filter shares for the specific user if needed
    const userShares = username ? shares.filter((share: any) => share.share_with === username) : shares;

    // Format the response to be more usable
    const formattedShares = userShares.map((share: any) => ({
      id: share.id,
      path: share.path,
      name: share.path.split('/').pop(),
      type: share.item_type, // 'file' or 'folder'
      owner: share.uid_owner,
      sharedBy: share.displayname_owner,
      permissions: {
        read: (share.permissions & 1) !== 0,
        update: (share.permissions & 2) !== 0,
        create: (share.permissions & 4) !== 0,
        delete: (share.permissions & 8) !== 0,
        share: (share.permissions & 16) !== 0,
      },
      shareTime: new Date(share.stime * 1000).toISOString(),
      url: share.url || null,
    }));
    return formattedShares;
  } catch (error) {
    console.error('Error getting shared items:', error instanceof Error ? error.message : String(error));
    throw error;
  }
};

// export const deleteShareInviteUser = async (shareId: string) => {
//   try {
//     // const deletedShare = await client.deleteShare(shareId);
//     // return deletedShare;
//   } catch (error) {
//     return error;
//   }
// };
