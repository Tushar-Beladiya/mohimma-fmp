import Client, { Folder } from 'nextcloud-node-client';
import { FileItem, FolderContents, FolderItem } from 'src/types/folders.types';

const client = new Client();

export const createFolder = async (folderName: string, subFolderPath?: string): Promise<Folder> => {
  try {
    //check subfolder have /

    const folder: Folder = await client.createFolder(subFolderPath ? subFolderPath : folderName);
    return folder;
  } catch (error) {
    throw new Error(error.message || 'Internal server error');
  }
};

export const deleteFolder = async (folderName: string, subFolderPath?: string): Promise<void> => {
  try {
    if (subFolderPath) {
      // Get the folder reference
      const folder = await client.getFolder(subFolderPath);

      if (folder) {
        // Delete the subfolder
        await folder.delete();
      }
    } else {
      await client.deleteFolder(folderName);
    }
  } catch (error) {
    throw new Error(error.message || 'Internal server error');
  }
};

export const getFilesAndFolders = async (folderPath: string, subFolderPath?: string): Promise<FolderContents> => {
  try {
    let targetPath = '/';

    // Construct target path based on provided parameters
    if (folderPath && subFolderPath) {
      targetPath = `/${subFolderPath}`;
    } else if (folderPath) {
      targetPath = `/${folderPath}`;
    }

    // Get contents of the target folder
    const contents = await client.getFolderContents(targetPath);

    const files: FileItem[] = [];
    const folders: FolderItem[] = [];

    contents.forEach((item) => {
      const itemInfo = {
        name: item.basename, // Correct property for name
        path: item.filename, // Correct property for path
        type: item.type, // 'file' or 'directory'
      };

      if (item.type === 'directory') {
        folders.push(itemInfo);
      } else {
        files.push(itemInfo);
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
  } catch (error) {
    throw new Error(error.message || 'Internal server error');
  }
};
