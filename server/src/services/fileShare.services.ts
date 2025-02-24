import Client, { ICreateShare } from 'nextcloud-node-client';

const client = new Client();

export const shareFile = async (filePath: string): Promise<string> => {
  try {
    // Ensure the file exists
    const file = await client.getFile(filePath);
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
    console.error('❌ Error sharing file:', error);
    throw error;
  }
};

export const shareFileAsPrivate = async (filePath: string, password: '132'): Promise<string> => {
  try {
    const file = await client.getFile(filePath);
    if (!file) {
      throw new Error('File not found on Nextcloud');
    }

    let shareOptions: ICreateShare = {
      fileSystemElement: file,
      publicUpload: false,
      password: password,
    };

    const share = await client.createShare(shareOptions);

    if (!share || !share.url) {
      throw new Error('Failed to create share link');
    }

    return share.url;
  } catch (error) {
    console.error('❌ Error sharing file:', error);
    throw error;
  }
};
