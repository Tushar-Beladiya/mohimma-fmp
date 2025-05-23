/* eslint-disable prettier/prettier */
import HttpError from '../helpers/error';
import { client, config } from '../config/nextCloudConfig';
import { createClient } from 'webdav';

interface SharedFile {
  name: string;
  path: string;
  type: string;
}

interface SharedFileResponse {
  file: SharedFile;
}

export const shareFile = async (filePath: string): Promise<string> => {
  // Ensure the file exists
  const file = await client.exists(filePath);
  if (!file) {
    throw new HttpError(404, 'File not found');
  }

  // Create the share link

  const share = await client.shares.add(filePath, 3);
  if (!share?.token) {
    throw new HttpError(500, 'Failed to create share link');
  }

  return `${config.frontendUrl}/sharedFile/file/${share.token}`;
};

export const shareFileAsPrivate = async (filePath: string, password: string): Promise<string> => {
  const file = await client.exists(filePath);

  if (!file) {
    throw new HttpError(404, 'File not found');
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

export const getSharedFile = async (token: string): Promise<SharedFileResponse> => {
  try {
    const shares = await client.shares.list();
    const share = shares.find((s) => s.token === token);

    if (!share?.url) {
      throw new HttpError(404, 'Shared file not found or invalid share URL');
    }

    const baseUrl = share.url.split('/index.php/s/')[0];
    const webdavClient = createClient(`${baseUrl}/remote.php/dav/files/${share.ownerUserId}`, {
      username: config.nextcloud.username,
      password: config.nextcloud.password,
      headers: { 'OCS-APIRequest': 'true' },
    });

    const fileStat = await webdavClient.stat(share.path);
    const fileData = 'data' in fileStat ? fileStat.data : fileStat;

    return {
      file: {
        name: fileData.basename,
        path: fileData.filename,
        type: fileData.type,
      },
    };
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, `Failed to retrieve shared file info: ${error.message}`);
  }
};
