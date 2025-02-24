import Client, { File as NextcloudFile } from 'nextcloud-node-client';
import { UploadRequestBody } from 'src/types/files.types';
import { Readable } from 'stream';
const client = new Client();

export const uploadFile = async (body: UploadRequestBody, file: Express.Multer.File): Promise<string> => {
  try {
    // Extract folder path from request body
    const { folderName, subFolderPath, fileName } = body;
    const actualFileName = fileName || file.originalname;

    // Convert buffer to stream
    const fileStream = new Readable();
    fileStream.push(file.buffer);
    fileStream.push(null);

    // Case 1: Both folderName and subFolderName are provided
    if (folderName && subFolderPath) {
      const remoteFolder = `/${subFolderPath}`;

      try {
        // Try to get existing folder
        const folder = await client.getFolder(remoteFolder);
        if (folder) await folder.createFile(actualFileName, fileStream);
      } catch (error) {
        // If folder doesn't exist, create it
        await client.createFolder(remoteFolder);
        const newFolder = await client.getFolder(remoteFolder);
        if (newFolder) await newFolder.createFile(actualFileName, fileStream);
      }

      return `${remoteFolder}/${actualFileName}`;
    }

    // Case 2: Only folderName is provided
    else if (folderName) {
      const remoteFolder = `/${folderName}`;

      try {
        // Try to get existing folder
        const folder = await client.getFolder(remoteFolder);
        if (folder) await folder.createFile(actualFileName, fileStream);
      } catch (error) {
        // If folder doesn't exist, create it
        await client.createFolder(remoteFolder);
        const newFolder = await client.getFolder(remoteFolder);
        if (newFolder) await newFolder.createFile(actualFileName, fileStream);
      }

      return `${remoteFolder}/${actualFileName}`;
    }

    // Case 3: No folder specified, upload to home directory
    else {
      const homeFolder = await client.getFolder('/');
      if (homeFolder) await homeFolder.createFile(actualFileName, fileStream);

      return `/${actualFileName}`;
    }
  } catch (error) {
    console.error(error);
    return '';
  }
};

export const downloadFile = async (file: NextcloudFile | null): Promise<Buffer> => {
  try {
    if (file) {
      const fileBuffer = await file.getContent();
      return fileBuffer;
    }
  } catch (error) {
    console.error(error);
    return Buffer.from('');
  }
  return Buffer.from('');
};

export const deleteFile = async (filePath: string): Promise<string> => {
  try {
    const file = await client.getFile(filePath);
    if (file) {
      await file.delete();
      return `File ${filePath} deleted successfully.`;
    }
  } catch (error) {
    console.error(error);
    return '';
  }
  return '';
};

export const copyFile = async (sourcePath: string, destinationPath: string): Promise<string> => {
  try {
    const sourceFile = await client.getFile(sourcePath);
    const destinationFolder = await client.getFolder(destinationPath);

    if (sourceFile && destinationFolder) {
      // Read the content of the source file
      const content = await sourceFile.getContent();
      console.log(sourceFile.name);
      // Create the duplicate file with the same content
      await destinationFolder.createFile(`${sourceFile.name.split('/').pop()}-copy` || 'copy-file', content);
      return destinationPath;
    }
  } catch (error) {
    console.error(error);
    return '';
  }
  return '';
};

export const renameFile = async (filePath: string, newFileName: string): Promise<string> => {
  try {
    const file = await client.getFile(filePath);
    if (file) {
      // Extract file extension
      const extensionMatch = filePath.match(/\.[^.]+$/); // Matches last dot followed by characters
      const extension = extensionMatch ? extensionMatch[0] : ''; // Keep extension if found

      // Append original extension to new file name
      const newFilePath = filePath.replace(/[^/]+$/, `${newFileName}${extension}`);

      // Move the file with its extension
      await file.move(newFilePath);

      return newFilePath;
    }
  } catch (error) {
    console.error('Rename failed:', error);
    return '';
  }
  return '';
};
