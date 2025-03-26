import NextcloudClient from 'nextcloud-link';
import { FileItem, FolderItem } from 'src/types/folders.types';
import { Readable } from 'stream';

const client = new NextcloudClient({
  url: process.env.NEXTCLOUD_URL || 'http://localhost:8080',
  password: process.env.NEXTCLOUD_PASSWORD,
  username: process.env.NEXTCLOUD_USERNAME,
});

async function checkFolderExists(path: string): Promise<boolean> {
  try {
    return !!(await client.get(path));
  } catch {
    return false;
  }
}

export const createFolder = async (folderName: string, subFolderPath?: string) => {
  try {
    const path = subFolderPath ? `/${subFolderPath}` : `/${folderName}`;

    if (subFolderPath) {
      const pathSegments = subFolderPath.split('/');
      const parentPath = pathSegments.slice(0, -1).join('/');
      if (!(await checkFolderExists(`/${parentPath}`))) throw new Error(`Parent folder "${parentPath}" does not exist`);
    }

    await client.createFolderHierarchy(path);

    return {
      baseName: subFolderPath ? subFolderPath.split('/').pop() : folderName,
      name: path,
    };
  } catch (error) {
    throw new Error(error.message || 'Internal server error');
  }
};

export const getFilesAndFolders = async (folderPath: string, subFolderPath?: string) => {
  try {
    let targetPath = '/';

    // Construct target path based on provided parameters
    if (folderPath && subFolderPath) {
      targetPath = `/${subFolderPath}`;
    } else if (folderPath) {
      targetPath = `/${folderPath}`;
    }

    // Get contents of the target folder
    const contents = await client.getFolderFileDetails(targetPath);

    const files: FileItem[] = [];
    const folders: FolderItem[] = [];

    contents.forEach((item) => {
      if (item.type === 'directory') {
        const folderInfo: FolderItem = {
          name: decodeURIComponent(item.name), // Correct property for name
          path: decodeURIComponent(item.href.replace(/\/remote\.php\/dav\/files\/admin/g, '')),
          type: 'directory', // 'directory'
        };
        folders.push(folderInfo);
      } else {
        const fileInfo: FileItem = {
          name: decodeURIComponent(item.name), // Correct property for name
          path: decodeURIComponent(item.href.replace(/\/remote\.php\/dav\/files\/admin/g, '')),
          type: 'file', // 'file'
        };
        files.push(fileInfo);
      }
    });
    return {
      path: targetPath,
      contents: {
        files,
        folders,
        totalFiles: files.length,
        totalFolders: folders.length,
      },
    };
    // return contents;
  } catch (error) {
    throw new Error(error.message || 'Internal server error');
  }
};

export const deleteFolder = async (subFolderPath: string): Promise<void> => {
  try {
    const path = `/${subFolderPath}`;
    if (path) {
      await client.remove(path);
    }
  } catch (error) {
    throw new Error(error.message || 'Internal server error');
  }
};

export const downloadFolder = async (folderPath: string): Promise<Record<string, string>> => {
  try {
    const sourceFolder = await client.exists(folderPath);
    if (!sourceFolder) {
      throw new Error('Folder not found');
    }

    const fileContents: Record<string, string> = {};

    const processFolder = async (currentPath: string) => {
      // Fetch files in the folder
      const filesProperties = await client.getFolderFileDetails(currentPath);
      const files = Array.isArray(filesProperties) ? filesProperties.filter((item) => item.type === 'file') : [];
      for (const file of files) {
        const filePath = currentPath + '/' + file.name;
        const filestream = (await client.getReadStream(filePath)) as Readable;
        const fileBuffer = await new Promise<Buffer>((resolve, reject) => {
          const chunks: Buffer[] = [];
          filestream.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
          filestream.on('end', () => resolve(Buffer.concat(chunks)));
          filestream.on('error', (err) => reject(err));
        });
        fileContents[filePath] = fileBuffer.toString('base64');
      }

      // Fetch subfolders
      const folderProperties = await client.getFolderFileDetails(currentPath);
      const subFolders = Array.isArray(folderProperties) ? folderProperties.filter((item) => item.type === 'directory') : [];
      for (const subfolder of subFolders) {
        await processFolder(currentPath + '/' + subfolder.name);
      }
    };

    await processFolder(folderPath);
    return fileContents;
  } catch (error) {
    console.error('Error retrieving folder contents:', error);
    throw new Error(error.message || 'Failed to retrieve folder contents');
  }
};

export const renameFolder = async (folderPath: string, newFolderName: string): Promise<string> => {
  try {
    const newFolderPath = folderPath.replace(/[^/]+$/, newFolderName);

    // Rename the folder
    if (newFolderName) {
      await client.rename(folderPath, newFolderName);
      return newFolderPath;
    } else {
      throw new Error('Folder name is required');
    }
  } catch (error) {
    throw new Error(error.message || 'Internal server error');
  }
};
