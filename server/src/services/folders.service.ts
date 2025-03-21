// import Client, { Folder } from 'nextcloud-node-client';
// import { FileItem, FolderContents, FolderItem } from 'src/types/folders.types';
// const client = new Client();

// export const downloadFolder = async (folderPath: string): Promise<Record<string, string>> => {
//   try {
//     const sourceFolder: Folder | null = await client.getFolder(folderPath);
//     console.log('sourceFolder****************', sourceFolder);

//     if (!sourceFolder) {
//       throw new Error('Folder not found');
//     }

//     // Map to store file contents
//     const fileContents: Record<string, string> = {};

//     const processFolder = async (folder: Folder, currentPath: string) => {
//       // Fetch files directly as buffers
//       const files = await folder.getFiles();
//       console.log('files get****---------------', files);

//       for (const file of files) {
//         const fileBuffer = await file.getContent();
//         console.log('fileBuffer****----------------------', fileBuffer);

//         if (!fileBuffer) {
//           throw new Error(`Failed to retrieve buffer for file: ${file.name}`);
//         }
//         const relativePath = currentPath.replace(folderPath, '').replace(/^\//, '') + '/' + file.name;
//         fileContents[relativePath] = fileBuffer.toString('base64');
//       }

//       // Recursively process subfolders
//       const subfolders = await folder.getSubFolders();
//       console.log('subfolders****----------------------', subfolders);
//       for (const subfolder of subfolders) {
//         await processFolder(subfolder, currentPath + '/' + subfolder.name);
//       }
//     };

//     await processFolder(sourceFolder, folderPath);
//     console.log('fileContents****----------------------', fileContents);

//     return fileContents;
//   } catch (error) {
//     console.error('Error retrieving folder contents:', error);
//     throw new Error(error.message || 'Failed to retrieve folder contents');
//   }
// };

// new code

import NextcloudClient from 'nextcloud-link';
import { FileItem, FolderItem } from 'src/types/folders.types';
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

// export const downloadFolder = async (folderPath: string): Promise<Record<string, string>> => {
//   try {
//     // Ensure connectivity
//     if (!(await client.checkConnectivity())) {
//       throw new Error('Failed to connect to Nextcloud instance');
//     }

//     // Map to store file contents
//     const fileContents: Record<string, string> = {};

//     const processFolder = async (currentPath: string) => {
//       // List files and subfolders
//       const items = await client.getFolderFileDetails(currentPath);
//       // console.log('items****----------------------', items);

//       for (const item of items) {
//         const properPath = decodeURIComponent(item.href.replace(/\/remote\.php\/dav\/files\/admin/g, ''));
//         const itemPath = `${properPath}`;

//         if (item.type === 'file') {
//           // Get the stream from nextcloud-link
//           const readStream = (await client.getReadStream(itemPath)) as Readable;

//           // console.log('readStream****----------------------', readStream);
//           const response = await client.downloadToStream(itemPath, readStream);
//           console.log('response****----------------------', response);

//           // // Collect data from the stream
//           // const chunks: Buffer[] = [];
//           // for await (const chunk of readStream) {
//           //   console.log('chunk****----------------------', chunk);

//           //   chunks.push(Buffer.from(chunk));
//           // }
//           // const fileBuffer = Buffer.concat(chunks);
//           // console.log('fileBuffer****----------------------', fileBuffer);
//           // Store base64-encoded content
//           // const relativePath = itemPath.replace(folderPath, '').replace(/^\//, '');
//           // fileContents[relativePath] = fileBuffer.toString('base64');
//         } else if (item.type === 'directory') {
//           // Recursively process subfolders
//           await processFolder(itemPath);
//         }
//       }
//     };

//     await processFolder(folderPath);

//     return fileContents;
//   } catch (error) {
//     console.error('Error retrieving folder contents:', error);
//     throw new Error(error.message || 'Failed to retrieve folder contents');
//   }
// };

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
