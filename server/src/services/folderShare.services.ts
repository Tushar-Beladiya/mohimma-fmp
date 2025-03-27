import { client } from '../config/nextCloudConfig';
import HttpError from '../helpers/error';

export const shareFolderAsPublic = async (filePath: string): Promise<string> => {
  // Ensure the file exists
  const file = await client.exists(filePath);
  if (!file) {
    throw new HttpError(404, 'File not found ');
  }

  // Create the share link
  const share = await client.shares.add(filePath, 3);

  if (!share || !share.url) {
    throw new HttpError(500, 'Failed to create share link');
  }

  return share.url;
};

export const shareFolderAsPrivate = async (filePath: string, password: string): Promise<string> => {
  const file = await client.exists(filePath);

  if (!file) {
    throw new HttpError(404, 'Folder not found ');
  }
  const share = await client.shares.add(filePath, 3, '', 1, '');

  if (!share || !share.id) {
    throw new HttpError(500, 'Failed to create share link');
  }

  await client.shares.edit.password(share.id, password);

  const updatedShare = await client.shares.get(share.id);

  if (!updatedShare || !updatedShare.url) {
    throw new HttpError(500, 'Failed to update share with password');
  }

  return updatedShare.url;
};
