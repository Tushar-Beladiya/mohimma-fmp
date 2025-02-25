import Client, { ICreateShare } from 'nextcloud-node-client';

const client = new Client();

export const shareFolderAsPublic = async (folderPath: string): Promise<string> => {
  try {
    // Ensure the file exists
    const file = await client.getFolder(folderPath);
    if (!file) {
      throw new Error('File not found on Nextcloud');
    }

    // Create share options
    let shareOptions: ICreateShare = {
      fileSystemElement: file,
      publicUpload: true, // true for public, false for private
    };

    // Create the share link
    const share = await client.createShare(shareOptions);

    if (!share || !share.url) {
      throw new Error('Failed to create share link');
    }

    return share.url;
  } catch (error) {
    console.error('Error sharing folder:', error);
    return '';
  }
};

export const shareFolderAsPrivate = async (folderPath: string, password: string): Promise<string> => {
  try {
    // Ensure the file exists
    const file = await client.getFolder(folderPath);
    if (!file) {
      throw new Error('File not found on Nextcloud');
    }

    // Create share options
    let shareOptions: ICreateShare = {
      fileSystemElement: file,
      password: password,
    };

    // Create the share link
    const share = await client.createShare(shareOptions);

    if (!share || !share.url) {
      throw new Error('Failed to create share link');
    }

    return share.url;
  } catch (error) {
    console.error('Error sharing folder:', error);
    return '';
  }
};
