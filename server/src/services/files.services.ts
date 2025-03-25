import NextcloudClient from 'nextcloud-link';
import { UploadRequestBody } from 'src/types/files.types';
import { Readable, Stream } from 'stream';

const client = new NextcloudClient({
  url: process.env.NEXTCLOUD_URL || 'http://localhost:8080',
  password: process.env.NEXTCLOUD_PASSWORD,
  username: process.env.NEXTCLOUD_USERNAME,
});

export const uploadFile = async (body: UploadRequestBody, file: Express.Multer.File): Promise<{}> => {
  try {
    const { folderName, subFolderPath, fileName } = body;
    const actualFileName = fileName || file.originalname;
    let remoteFolder = '';

    if (folderName && subFolderPath) {
      remoteFolder = `/${subFolderPath}`;
    } else if (folderName) {
      remoteFolder = `/${folderName}`;
    }

    // Ensure folder exists
    const folderExists = await client.exists(remoteFolder);
    if (!folderExists) {
      await client.createFolderHierarchy(remoteFolder); // Create the folder if it doesn't exist
    }

    // Full file path
    const remoteFilePath = `${remoteFolder}/${actualFileName}`;

    // Check if file already exists
    const fileExists = await client.exists(remoteFilePath);
    if (fileExists) {
      return { error: 'File already exists', path: remoteFilePath };
    }

    await client.put(remoteFilePath, file.buffer);

    return { path: remoteFilePath, name: actualFileName };
  } catch (error) {
    console.error('Upload error:', error);
    return { error: 'File upload failed' };
  }
};
export const downloadFile = async (filePath: string): Promise<Stream> => {
  try {
    const file = await client.exists(filePath);
    if (file) {
      const filestream = (await client.getReadStream(filePath)) as Readable;

      return filestream;
    }
    throw new Error('File not found');
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error; // Better to throw than return empty buffer
  }
};

export const deleteFile = async (filePath: string): Promise<string> => {
  try {
    const file = await client.exists(filePath);
    if (file) {
      await client.remove(filePath);
      return `File ${filePath} deleted successfully.`;
    }
  } catch (error) {
    console.error(error);
    return '';
  }
  return '';
};

export const copyFile = async (sourcePath: string, destinationPath: string): Promise<{}> => {
  try {
    const sourceFile = await client.exists(sourcePath);
    const destinationFolder = await client.exists(`/${destinationPath}`);

    if (sourceFile && destinationFolder) {
      // Read the content of the source file
      const content = await client.get(sourcePath);

      // Extract the file name and extension
      const fileName = sourcePath.split('/').pop(); // Get file name
      if (!fileName) throw new Error('File name is undefined');
      const match = fileName.match(/(.*?)(\.[^.]+)?$/);
      if (!match) throw new Error('File name match is null');
      const [name, extension] = match.slice(1); // Separate name & extension

      // Get list of files in destination folder
      const existingFiles = await client.getFiles(`/${destinationPath}`);
      const existingFileNames = existingFiles.map((file) => file);

      // Generate a unique file name by appending an index if needed
      let newFileName = fileName;
      let index = 1;
      while (existingFileNames.some((n) => n.includes(newFileName))) {
        newFileName = `${name} (${index})${extension || ''}`;
        index++;
      }
      const fileBuffer = Buffer.isBuffer(content) ? content : Buffer.from(content, 'binary');
      // Create the duplicate file with the unique name
      const mockFile: Express.Multer.File = {
        fieldname: '',
        originalname: newFileName,
        encoding: '7bit',
        mimetype: 'application/octet-stream',
        size: fileBuffer.length,
        buffer: fileBuffer,
        stream: new Readable(),
        destination: '',
        filename: '',
        path: '',
      };
      await uploadFile({ folderName: `/${destinationPath}`, fileName: newFileName }, mockFile);

      return { path: `/${destinationPath}/${newFileName}`, name: newFileName };
    }
  } catch (error) {
    console.error(error);
    return { error: 'File copy failed' };
  }
  return { error: 'File copy failed' };
};

export const renameFile = async (filePath: string, newFileName: string): Promise<{}> => {
  try {
    const file = await client.exists(filePath);
    if (file) {
      // Extract file extension
      const extensionMatch = filePath.match(/\.[^.]+$/); // Matches last dot followed by characters
      const extension = extensionMatch ? extensionMatch[0] : ''; // Keep extension if found

      // Append original extension to new file name
      const newFilePath = filePath.replace(/[^/]+$/, `${newFileName}${extension}`);

      // Move the file with its extension
      await client.rename(filePath, `${newFileName}${extension}`);

      return { path: newFilePath, newFileName: `${newFileName}${extension}` };
    }
  } catch (error) {
    console.error('Rename failed:', error);
    return { error: 'file not found' };
  }
  return { error: 'file not found' };
};
