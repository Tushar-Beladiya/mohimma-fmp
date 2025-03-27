import { Readable, Stream } from 'stream';
import { client } from '../config/nextCloudConfig';
import HttpError from '../helpers/error';
import { UploadRequestBody } from '../types/files.types';

export const uploadFile = async (body: UploadRequestBody, file: Express.Multer.File): Promise<{}> => {
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
    throw new HttpError(409, 'File already exists');
  }

  await client.put(remoteFilePath, file.buffer);

  return { path: remoteFilePath, name: actualFileName };
};

export const downloadFile = async (filePath: string): Promise<Stream> => {
  const file = await client.exists(filePath);
  if (file) {
    const filestream = (await client.getReadStream(filePath)) as Readable;

    return filestream;
  }
  throw new HttpError(404, 'File not found');
};

export const deleteFile = async (filePath: string): Promise<string> => {
  const file = await client.exists(filePath);
  if (file) {
    await client.remove(filePath);
    return `File ${filePath} deleted successfully.`;
  }
  throw new HttpError(404, 'File not found');
};

export const copyFile = async (sourcePath: string, destinationPath: string): Promise<{}> => {
  const sourceFile = await client.exists(sourcePath);
  const destinationFolder = await client.exists(`/${destinationPath}`);

  if (sourceFile && destinationFolder) {
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

    const filestream = await client.getReadStream(sourcePath);
    const fileBuffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      filestream.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
      filestream.on('end', () => resolve(Buffer.concat(chunks)));
      filestream.on('error', (err) => reject(err));
    });

    await client.put(`/${destinationPath}/${newFileName}`, fileBuffer);

    return { path: `/${destinationPath}/${newFileName}`, name: newFileName };
  }
  throw new HttpError(404, 'Failed to copy file');
};

export const renameFile = async (filePath: string, newFileName: string): Promise<{}> => {
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
  throw new HttpError(404, 'File not found');
};
