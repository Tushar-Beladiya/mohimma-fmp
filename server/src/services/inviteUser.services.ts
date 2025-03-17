import Client, { Share } from 'nextcloud-node-client';
const client = new Client();

declare module 'nextcloud-node-client' {
  interface ICreateShare {
    shareType?: number;
    shareWith?: string;
  }
}

// const userExists = async (username: string) => {
//   try {
//     const response = await client.getUsers(username);
//     console.log(response);
//     return response.length > 0;
//   } catch (error) {
//     if (error.response && error.response.status === 404) {
//       return false; // User not found
//     }
//     throw error;
//   }
// };

// const createUser = async (username: string) => {
//   try {
//     const checkUserExists = await userExists(username);
//     if (checkUserExists) return checkUserExists;
//     const user = await client.createUser({ id: username, email: username });
//     return user;
//   } catch (error) {
//     throw error;
//   }
// };

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

    // Ensure the file exists
    const folder = await client.getFolder(folderPath);
    if (!folder) {
      throw new Error('Folder not found on Nextcloud');
    }

    const share = await Share.createShareRequestBody({
      fileSystemElement: folder,
      shareWith: username,
    });
    return share;
    // console.log(`Folder ${folderPath} shared with user ${username}. Share ID: ${share.id}`);
  } catch (error) {
    console.error('Error sharing folder:', error.message);
  }
};
