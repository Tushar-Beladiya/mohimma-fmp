import { client, config } from '../config/nextCloudConfig';
import HttpError from '../helpers/error';
import { createClient, FileStat } from 'webdav';

interface SharedItem {
  name: string;
  path: string;
  type: string;
}

interface SharedFolderResponse {
  contents: SharedItem[];
  folderName: string;
}

export const shareFolderAsPublic = async (filePath: string): Promise<string> => {
  const file = await client.exists(filePath);
  if (!file) {
    throw new HttpError(404, 'Folder not found');
  }

  const share = await client.shares.add(filePath, 3);
  if (!share?.token) {
    throw new HttpError(500, 'Failed to create share link');
  }

  return `${config.frontendUrl}/shared/folder/${share.token}`;
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

  // return updatedShare.url;
  return `${config.frontendUrl}/shared/folder/${updatedShare.token}`;
};

// export const getSharedFolderContents = async (token: string, subPath?: string): Promise<SharedFolderResponse> => {
//   try {
//     const shares = await client.shares.list();
//     const share = shares.find((s) => s.token === token);

//     if (!share?.url) {
//       throw new HttpError(404, 'Shared folder not found or invalid share URL');
//     }

//     const baseUrl = share.url.split('/index.php/s/')[0];
//     const webdavClient = createClient(`${baseUrl}/remote.php/dav/files/${share.ownerUserId}`, {
//       username: config.nextcloud.username,
//       password: config.nextcloud.password,
//       headers: { 'OCS-APIRequest': 'true' },
//     });

//     // Construct the full path by combining share.path with subPath
//     const fullPath = subPath ? `${share.path}/${subPath}` : share.path;

//     // Validate that the requested path is within the shared folder
//     if (!fullPath.startsWith(share.path)) {
//       throw new HttpError(403, 'Access denied: Path is outside shared folder');
//     }

//     const response = await webdavClient.getDirectoryContents(fullPath);
//     const contents = Array.isArray(response) ? response : response.data;

//     return {
//       contents: contents.map((item: FileStat) => ({
//         name: item.basename,
//         path: item.filename,
//         type: item.type,
//       })),
//       folderName: share.path,
//     };
//   } catch (error) {
//     if (error instanceof HttpError) {
//       throw error;
//     }
//     throw new HttpError(500, `Failed to retrieve shared folder contents: ${error.message}`);
//   }
// };

export const getSharedFolderContents = async (token: string, subPath?: string, password?: string): Promise<SharedFolderResponse> => {
  try {
    const shares = await client.shares.list();
    const share = shares.find((s) => s.token === token);

    if (!share?.url) {
      throw new HttpError(404, 'Shared folder not found or invalid share URL');
    }

    // If the share is password protected, verify the password
    if (share.shareType === 3) {
      // public link
      if (!password) {
        throw new HttpError(401, 'Password required for this shared folder');
      }

      try {
        const webdavClient = createClient(`${process.env.NEXTCLOUD_URL}/public.php/webdav/`, {
          username: token, // Share token
          password: password, // User-provided password
        });

        // This checks access using the public share
        await webdavClient.getDirectoryContents(subPath || '/');
      } catch (error) {
        throw new HttpError(401, 'Invalid password for this shared folder');
      }
    }

    const baseUrl = share.url.split('/index.php/s/')[0];
    const webdavClient = createClient(`${baseUrl}/remote.php/dav/files/${share.ownerUserId}`, {
      username: config.nextcloud.username,
      password: config.nextcloud.password,
      headers: { 'OCS-APIRequest': 'true' },
    });

    // Construct the full path by combining share.path with subPath
    const fullPath = subPath ? `${share.path}/${subPath}` : share.path;

    // Validate that the requested path is within the shared folder
    if (!fullPath.startsWith(share.path)) {
      throw new HttpError(403, 'Access denied: Path is outside shared folder');
    }

    const response = await webdavClient.getDirectoryContents(fullPath);
    const contents = Array.isArray(response) ? response : response.data;

    return {
      contents: contents.map((item: FileStat) => ({
        name: item.basename,
        path: item.filename,
        type: item.type,
      })),
      folderName: share.path,
    };
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, `Failed to retrieve shared folder contents: ${error.message}`);
  }
};
