import NextcloudClient from 'nextcloud-link';

const client = new NextcloudClient({
  url: process.env.NEXTCLOUD_URL || 'http://localhost:8080',
  password: process.env.NEXTCLOUD_PASSWORD,
  username: process.env.NEXTCLOUD_USERNAME,
});

interface ShareResult {
  sharedWith: string;
  [key: string]: any;
}

interface ShareItem {
  id: number;
  path: string;
  itemType: string;
  sharedWith: string;
  [key: string]: any;
}

async function shareRecursively(path: string, username: string): Promise<ShareResult[]> {
  try {
    // Check if item is already shared with this user
    const itemShares: ShareResult[] = await client.shares.list(path);
    const isAlreadyShared: boolean = itemShares.some((share: ShareResult) => share.sharedWith === username);

    let shareResult: ShareResult[] = [];

    if (!isAlreadyShared) {
      // Share the item with the user
      await client.shares.add(path, 0, username, 31);

      // Get the newly created share
      const newShares: ShareResult[] = await client.shares.list(path);
      shareResult = newShares.filter((share: ShareResult) => share.sharedWith === username);
    } else {
      shareResult = itemShares.filter((share: ShareResult) => share.sharedWith === username);
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
          const subResults: ShareResult[] = await shareRecursively(itemPath, username);
          shareResult = [...shareResult, ...subResults];
        }
      } else {
        const folderContents: string[] = await client.getFiles(path);

        // Process each item recursively
        for (const item of folderContents) {
          const itemPath = `${path}/${item}`;
          // Recursively share this item
          const subResults: ShareResult[] = await shareRecursively(itemPath, username);
          shareResult = [...shareResult, ...subResults];
        }
      }
    });

    return shareResult;
  } catch (error) {
    console.error(`Error sharing ${path}:`, error);
    return [];
  }
}

export const InviteUser = async (path: string, username: string) => {
  try {
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

    return {
      success: true,
      message: 'Folder shared successfully',
      result: response,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to share folder',
    };
  }
};

export const getSharedData = async (username?: string, path?: string) => {
  try {
    const shares = await client.shares.list(path);
    if (!username) {
      return { success: true, result: shares };
    }
    // Filter by username only when needed
    return { success: true, result: shares.filter((share) => share.sharedWith === username) };
  } catch (error) {
    return { success: false };
  }
};

export const getUsers = async () => {
  try {
    const users = await client.users.list();
    return { success: true, result: users };
  } catch (error) {
    return { success: false };
  }
};

export const updateSharePermission = async (shareId: string | number, permissions: number) => {
  try {
    const response = await client.shares.edit.permissions(shareId, permissions);
    return { success: true, message: 'Share updated successfully', result: response };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to update share',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const deleteUser = async (userId: string) => {
  try {
    await client.users.delete(userId);
    return { success: true, message: 'User deleted successfully', result: userId };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

async function deleteSharesRecursively(shareId: number, path: string, shareWith: string): Promise<number[]> {
  try {
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
        const itemShares: ShareItem[] = await client.shares.list(itemPath);

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
      console.error(`Error processing contents of folder ${path}:`, error);
    }

    return deletedIds;
  } catch (error) {
    console.error(`Error deleting share ${shareId}:`, error);
    return [];
  }
}

export const deleteShareItem = async (shareId: number, shareWith: string) => {
  try {
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
    if (shareWith !== null) {
      const data = await getSharedData(shareWith);
      if (data && data.result && data.result.length === 0) {
        deleteUser(shareWith);
      }
    }

    return {
      success: true,
      message: 'Share(s) deleted successfully',
      result: deletedIds,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};
