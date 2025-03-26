import { Request, Response } from 'express';
import { filesService } from '../services';

export const uploadFile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const file = req.file as Express.Multer.File;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'File is required',
      });
    }

    const fileData = await filesService.uploadFile(req.body, file);

    return res.status(201).json({
      success: true,
      message: `File uploaded successfully`,
      result: fileData,
    });
  } catch (error) {
    console.error('❌ Error uploading file:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

export const downloadFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { filePath } = req.query;

    if (!filePath || typeof filePath !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Missing or invalid filePath parameter.',
      });
    }

    const fileBuffer = await filesService.downloadFile(filePath as string);

    // Extract filename from the path
    const fileName = (typeof filePath === 'string' ? filePath : '').split('/').pop() || 'downloaded_file';

    // Set response headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    res.status(200).json({
      success: true,
      message: 'File download successful',
      result: fileBuffer,
    });
  } catch (error) {
    console.error('❌ Error downloading file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download file',
      error: error.message,
    });
  }
};

export const deleteFile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { filePath } = req.query;

    if (!filePath || typeof filePath !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Missing or invalid filePath parameter.',
      });
    }

    const path = await filesService.deleteFile(filePath);

    return res.status(200).json({
      success: true,
      message: `File deleted successfully`,
      result: path,
    });
  } catch (error) {
    console.error('❌ Error deleting file:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

export const copyFile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { sourcePath, destinationPath } = req.body;

    if (!sourcePath || !destinationPath) {
      return res.status(400).json({
        success: false,
        message: 'Missing sourcePath or destinationPath parameter.',
      });
    }

    const path = await filesService.copyFile(sourcePath, destinationPath);

    return res.status(200).json({
      success: true,
      message: `File copied successfully`,
      result: path,
    });
  } catch (error) {
    console.error('❌ Error copying file:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

export const renameFile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { filePath, newFileName } = req.body;

    if (!filePath || !newFileName) {
      return res.status(400).json({
        success: false,
        message: 'Missing filePath or newFileName parameter.',
      });
    }

    const fileData = await filesService.renameFile(filePath, newFileName);
    return res.status(200).json({
      success: true,
      message: `File renamed successfully`,
      result: { ...fileData, oldFileName: filePath.split('/').pop() },
    });
  } catch (error) {
    console.error('❌ Error renaming file:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

export const previewFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { filePath } = req.query;

    if (!filePath || typeof filePath !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Missing or invalid filePath parameter.',
      });
    }

    const filestream = await filesService.downloadFile(filePath as string);
    const fileBuffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      filestream.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
      filestream.on('end', () => resolve(Buffer.concat(chunks)));
      filestream.on('error', (err) => reject(err));
    });

    res.status(200).json({
      success: true,
      message: 'File preview successful',
      result: fileBuffer,
    });
  } catch (error) {
    console.error('❌ Error previewing file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to preview file',
      error: error.message,
    });
  }
};
