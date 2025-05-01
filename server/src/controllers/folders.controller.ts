import { Request, Response } from 'express';
import { foldersService } from '../services';
import HttpError from '../helpers/error';

export const createFolder = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { folderName, subFolderPath } = req.body;
    if (!folderName) {
      throw new HttpError(422, 'Folder name is required');
    }

    const folder = await foldersService.createFolder(folderName, subFolderPath);

    return res.status(201).json({
      success: true,
      message: `${subFolderPath ? subFolderPath : folderName} folder created successfully`,
      result: folder,
    });
  } catch (err) {
    if (err instanceof HttpError) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: err.message || 'Internal server error',
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
  } catch (err) {
    if (err instanceof HttpError) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: err.message || 'Internal server error',
    });
  }
};

export const deleteFolder = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Extract folder path from request body
    const { folderName, subFolderPath } = req.query;
    if (!subFolderPath) {
      throw new HttpError(422, 'subFolderPath is required');
    }
    await foldersService.deleteFolder(subFolderPath as string);
    return res.status(200).json({
      success: true,
      message: `${folderName} folder deleted successfully`,
    });
  } catch (err) {
    if (err instanceof HttpError) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: err.message || 'Internal server error',
    });
  }
};

export const downloadFolder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { folderPath } = req.query;
    if (!folderPath) {
      throw new HttpError(422, 'Folder path is required');
    }
    const folder = await foldersService.downloadFolder(folderPath as string);
    res.status(200).json({
      success: true,
      message: 'folders fetched successfully',
      result: folder,
    });
  } catch (err) {
    if (err instanceof HttpError) {
      res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
    }
    res.status(500).json({
      success: false,
      message: err.message || 'Internal server error',
    });
  }
};

export const renameFolder = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { folderPath, newFolderName } = req.body;
    if (!folderPath || !newFolderName) {
      throw new HttpError(422, 'Folder name and new folder name are required');
    }
    const path = await foldersService.renameFolder(folderPath, newFolderName);
    return res.status(200).json({
      success: true,
      message: `${folderPath} folder renamed to ${newFolderName} successfully`,
      result: { path, newFolderName, oldFolderName: folderPath.split('/').pop() },
    });
  } catch (err) {
    if (err instanceof HttpError) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: err.message || 'Internal server error',
    });
  }
};

export const getAllFilesAndFoldersWithNestedFolders = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const folders = await foldersService.getAllFilesAndFoldersWithNestedFolders();
    return res.status(200).json({
      success: true,
      message: 'Folders fetched successfully',
      result: folders,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Internal server error',
    });
  }
};
