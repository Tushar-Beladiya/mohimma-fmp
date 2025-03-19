import NextcloudClient from 'nextcloud-link';

const client = new NextcloudClient({
  url: process.env.NEXTCLOUD_URL || 'http://localhost:8080',
  password: process.env.NEXTCLOUD_PASSWORD,
  username: process.env.NEXTCLOUD_USERNAME,
});

export const InviteUser = async (path: string, username: string) => {
  try {
    const existingUsers = await client.users.list();
    const userExists = existingUsers.some((user) => user === username);

    if (!userExists) {
      await client.users.add({ userid: username, email: username });
    }

    const response = await client.shares.add(path, 0, username, 31);
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

export const deleteShareItem = async (shareId: string, shareWith: string) => {
  try {
    await client.shares.delete(shareId);
    if (shareWith !== null) {
      const data = await getSharedData(shareWith);
      if (data && data.result && data.result.length === 0) {
        deleteUser(shareWith);
      }
    }
    return { success: true, message: 'Share deleted successfully', result: shareId };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const updateShareInviteUser = async (shareId: string | number, permissions: number) => {
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
