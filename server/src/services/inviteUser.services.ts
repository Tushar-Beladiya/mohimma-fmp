import { OcsShare } from 'nextcloud-link/compiled/source/types';
import { client } from '../config/nextCloudConfig';
import HttpError from '../helpers/error';

const shareRecursively = async (path: string, username: string) => {
  // Check if item is already shared with this user
  const itemShares = await client.shares.list(path);
  const isAlreadyShared: boolean = itemShares.some((share) => share.sharedWith === username);

  let shareResult: OcsShare[] = [];

  if (!isAlreadyShared) {
    // Share the item with the user
    await client.shares.add(path, 0, username, 31);

    // Get the newly created share
    const newShares = await client.shares.list(path);
    shareResult = newShares.filter((share) => share.sharedWith === username);
  } else {
    shareResult = itemShares.filter((share) => share.sharedWith === username);
  }

  // Check if this is a folder
  const itemInfo = await client.getFolderFileDetails(path);

  itemInfo.map(async (item) => {
    if (item.type !== 'file') {
      // Get all contents of the folder
      const folderContents: string[] = await client.getFiles(path);

      // Process each item recursively
      for (const item of folderContents) {
        const itemPath = `${path}/${item}`;
        // Recursively share this item
        const subResults = await shareRecursively(itemPath, username);
        shareResult = [...shareResult, ...subResults];
      }
    } else {
      const folderContents: string[] = await client.getFiles(path);

      // Process each item recursively
      for (const item of folderContents) {
        const itemPath = `${path}/${item}`;
        // Recursively share this item
        const subResults = await shareRecursively(itemPath, username);
        shareResult = [...shareResult, ...subResults];
      }
    }
  });

  return shareResult;
};

export const inviteUser = async (path: string, username: string) => {
  const existingUsers = await client.users.list();
  const userExists = existingUsers.some((user) => user === username);

  if (!userExists) {
    await client.users.add({ userid: username, email: username });
  }

  const share = await client.shares.add(path, 0, username, 31);
  let response;
  if (share.itemType === 'folder') {
    const folderPath = share.path;
    response = await shareRecursively(folderPath, username);
  } else {
    response = share;
  }

  return response;
};

export const getSharedData = async (username?: string, path?: string) => {
  const shares = await client.shares.list(path);
  if (!username) {
    return shares;
  }
  // Filter by username only when needed
  return shares.filter((share) => share.sharedWith === username);
};

export const getUsers = async () => {
  const users = await client.users.list();
  return users;
};

export const updateSharePermission = async (shareId: string | number, permissions: number) => {
  const response = await client.shares.edit.permissions(shareId, permissions);
  return response;
};

export const deleteUser = async (userId: string) => {
  await client.users.delete(userId);
  return userId;
};

const deleteSharesRecursively = async (shareId: number, path: string, shareWith: string): Promise<number[]> => {
  // Delete the current share
  await client.shares.delete(shareId);
  const deletedIds = [shareId];

  // Try to get all files & subfolders inside the folder
  try {
    const folderContents: string[] = await client.getFiles(path);

    // Process each item in the folder
    for (const item of folderContents) {
      const itemPath = `${path}/${item}`;

      // Get all shares for this item
      const itemShares: OcsShare[] = await client.shares.list(itemPath);

      // Find shares belonging to the specified user
      const userShares = itemShares.filter((share) => share.sharedWith === shareWith);

      // Process each share recursively
      for (const share of userShares) {
        if (share.itemType === 'folder') {
          // Recursively delete folder contents
          const subDeletedIds = await deleteSharesRecursively(share.id, share.path, shareWith);
          deletedIds.push(...subDeletedIds);
        } else {
          // Delete file share
          await client.shares.delete(share.id);
          deletedIds.push(share.id);
        }
      }
    }
  } catch (error) {
    throw new HttpError(400, error.message);
  }

  return deletedIds;
};

export const deleteShareItem = async (shareId: number, shareWith: string) => {
  let deletedIds: number[] = [];
  // If we know this is a folder and have the path, use recursive deletion
  const itemInfo = await client.shares.get(shareId);

  if (itemInfo.itemType === 'folder' && itemInfo.path) {
    deletedIds = await deleteSharesRecursively(shareId, itemInfo.path, shareWith);
  } else {
    // Just delete the single share
    await client.shares.delete(shareId);
    deletedIds = [shareId];
  }

  // Check if user has any remaining shares
  // if (shareWith !== null) {
  //   const data = await getSharedData(shareWith);
  //   if (data) {
  //     deleteUser(shareWith);
  //   }
  // }

  return deletedIds;
};
