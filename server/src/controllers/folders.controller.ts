// new code

import { Request, Response } from 'express';
import { foldersService } from '../services';

export const createFolder = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Extract folder path from request body
    const { folderName, subFolderPath } = req.body;
    if (!folderName) {
      return res.status(400).json({ success: false, message: 'Folder name is required' });
    }

    const folder = await foldersService.createFolder(folderName, subFolderPath);

    return res.status(201).json({
      success: true,
      message: `${subFolderPath ? subFolderPath : folderName} folder created successfully`,
      result: folder,
    });
  } catch (error) {
    console.error('❌ Error creating folder:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

export const getFilesAndFolders = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { folderPath, subFolderPath } = req.query;

    const filesAndFolders = await foldersService.getFilesAndFolders(folderPath as string, subFolderPath as string);

    return res.status(200).json({
      success: true,
      message: 'Files and folders fetched successfully',
      result: filesAndFolders,
    });
  } catch (error) {
    console.error('❌ Error fetching files and folders:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

export const deleteFolder = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Extract folder path from request body
    const { folderName, subFolderPath } = req.query;
    if (!subFolderPath) {
      return res.status(400).json({ success: false, message: 'Folder name is required' });
    }
    await foldersService.deleteFolder(subFolderPath as string);
    return res.status(200).json({
      success: true,
      message: `${folderName} folder deleted successfully`,
    });
  } catch (error) {
    console.error('❌ Error deleting folder:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// export const downloadFolder = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { folderPath } = req.query;
//     const folder = await foldersService.downloadFolder(folderPath as string);
//     res.status(200).json({
//       success: true,
//       message: 'folders fetched successfully',
//       result: folder,
//     });
//   } catch (error) {
//     console.error('❌ Error downloading folder:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message || 'Internal server error',
//     });
//   }
// };

export const renameFolder = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { folderPath, newFolderName } = req.body;
    if (!folderPath || !newFolderName) {
      return res.status(400).json({ success: false, message: 'Folder name and new folder name are required' });
    }
    const path = await foldersService.renameFolder(folderPath, newFolderName);
    return res.status(200).json({
      success: true,
      message: `${folderPath} folder renamed to ${newFolderName} successfully`,
      result: { path, newFolderName, oldFolderName: folderPath.split('/').pop() },
    });
  } catch (error) {
    console.error('❌ Error renaming folder:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};
