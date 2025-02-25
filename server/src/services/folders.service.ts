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

export const renameFolder = async (folderPath: string, newFolderName: string): Promise<void> => {
  try {
    // Get the folder to rename
    const folder = await client.getFolder(folderPath);

    // Rename the folder
    await folder?.move(folderPath.replace(/[^/]+$/, newFolderName));
    console.log(`Folder renamed successfully to: ${newFolderName}`);
  } catch (error) {
    throw new Error(error.message || 'Internal server error');
  }
};

export const downloadFolder = async (folderPath: string): Promise<Record<string, string>> => {
  try {
    const sourceFolder: Folder | null = await client.getFolder(folderPath);
    if (!sourceFolder) {
      throw new Error('Folder not found');
    }

    // Map to store file contents
    const fileContents: Record<string, string> = {};

    const processFolder = async (folder: Folder, currentPath: string) => {
      // Fetch files directly as buffers
      const files = await folder.getFiles();
      for (const file of files) {
        const fileBuffer = await file.getContent();
        if (!fileBuffer) {
          throw new Error(`Failed to retrieve buffer for file: ${file.name}`);
        }
        const relativePath = currentPath.replace(folderPath, '').replace(/^\//, '') + '/' + file.name;
        fileContents[relativePath] = fileBuffer.toString('base64');
      }

      // Recursively process subfolders
      const subfolders = await folder.getSubFolders();
      for (const subfolder of subfolders) {
        await processFolder(subfolder, currentPath + '/' + subfolder.name);
      }
    };

    await processFolder(sourceFolder, folderPath);
    return fileContents;
  } catch (error) {
    console.error('Error retrieving folder contents:', error);
    throw new Error(error.message || 'Failed to retrieve folder contents');
  }
};
