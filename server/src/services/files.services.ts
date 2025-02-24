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

      // Method 1: Check PDF magic number
      const isPDF = fileBuffer.slice(0, 4).toString() === '%PDF';

      // Method 2: Check file size
      const sizeInMB = fileBuffer.length / (1024 * 1024);

      // Method 3: Log first few bytes for inspection
      const firstBytes = fileBuffer.slice(0, 50).toString('hex');

      // Method 4: Check if buffer is corrupted
      const isCorrupted = fileBuffer.length === 0 || !Buffer.isBuffer(fileBuffer);

      // Debug information
      console.log({
        isPDF,
        sizeInMB,
        firstBytes,
        isCorrupted,
        bufferLength: fileBuffer.length,
        // Log first 100 characters if it's text
        preview: fileBuffer.slice(0, 100).toString(),
      });

      return fileBuffer;
    }
  } catch (error) {
    console.error(error);
    return Buffer.from('');
  }
  return Buffer.from('');
};
