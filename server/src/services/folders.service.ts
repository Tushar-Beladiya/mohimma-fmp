import HttpError from '../helpers/error';
import { client } from '../config/nextCloudConfig';
import { FileItem, FolderItem } from '../types/folders.types';
import { Readable } from 'stream';

const checkFolderExists = async (path: string): Promise<boolean> => {
  return !!(await client.get(path));
};

export const createFolder = async (folderName: string, subFolderPath?: string) => {
  const path = subFolderPath ? `/${subFolderPath}` : `/${folderName}`;

  if (subFolderPath) {
    const pathSegments = subFolderPath.split('/');
    const parentPath = pathSegments.slice(0, -1).join('/');
    if (!(await checkFolderExists(`/${parentPath}`))) throw new HttpError(422, `Parent folder "${parentPath}" does not exist`);
  }

  await client.createFolderHierarchy(path);

  return {
    baseName: subFolderPath ? subFolderPath.split('/').pop() : folderName,
    name: path,
  };
};

export const getFilesAndFolders = async (folderPath: string, subFolderPath?: string) => {
  let targetPath = '/';

  if (folderPath && subFolderPath) {
    targetPath = `/${subFolderPath}`;
  } else if (folderPath) {
    targetPath = `/${folderPath}`;
  }

  const contents = await client.getFolderFileDetails(targetPath);

  const files: FileItem[] = [];
  const folders: FolderItem[] = [];

  contents.forEach(({ name, href, type }: { name: string; href: string; type: string }) => {
    const decodedName = decodeURIComponent(name);
    const decodedPath = decodeURIComponent(href.replace(/\/remote\.php\/dav\/files\/admin/g, ''));

    const itemInfo = { name: decodedName, path: decodedPath, type };

    type === 'directory' ? folders.push(itemInfo as FolderItem) : files.push(itemInfo as FileItem);
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
};

export const deleteFolder = async (subFolderPath: string): Promise<void> => {
  const path = `/${subFolderPath}`;
  if (path) {
    await client.remove(path);
  }
};

export const downloadFolder = async (folderPath: string): Promise<Record<string, string>> => {
  const sourceFolder = await client.exists(folderPath);
  if (!sourceFolder) {
    throw new HttpError(404, 'Folder not found');
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
};

export const renameFolder = async (folderPath: string, newFolderName: string): Promise<string> => {
  const newFolderPath = folderPath.replace(/[^/]+$/, newFolderName);

  if (newFolderName) {
    await client.rename(folderPath, newFolderName);
    return newFolderPath;
  } else {
    throw new HttpError(422, 'New folder name is required');
  }
};
