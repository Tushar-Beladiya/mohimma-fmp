import NextcloudClient from 'nextcloud-link';

const client = new NextcloudClient({
  url: process.env.NEXTCLOUD_URL || 'http://localhost:8080',
  password: process.env.NEXTCLOUD_PASSWORD,
  username: process.env.NEXTCLOUD_USERNAME,
});

export const shareFile = async (filePath: string): Promise<string> => {
  try {
    // Ensure the file exists
    const file = await client.exists(filePath);
    if (!file) {
      throw new Error('File not found on Nextcloud');
    }

    // Create the share link

    const share = await client.shares.add(filePath, 3);

    if (!share || !share.url) {
      throw new Error('Failed to create share link');
    }

    return share.url;
  } catch (error) {
    console.error('❌ Error sharing file:', error);
    throw error;
  }
};

export const shareFileAsPrivate = async (filePath: string, password: string): Promise<string> => {
  try {
    const file = await client.exists(filePath);

    if (!file) {
      throw new Error('File not found on Nextcloud');
    }
    const share = await client.shares.add(filePath, 3, '', 1, '');

    if (!share || !share.id) {
      throw new Error('Failed to create share link');
    }

    await client.shares.edit.password(share.id, password);

    const updatedShare = await client.shares.get(share.id);

    if (!updatedShare || !updatedShare.url) {
      throw new Error('Failed to update share with password');
    }

    return updatedShare.url;
  } catch (error) {
    console.error('❌ Error sharing file:', error);
    throw error;
  }
};
