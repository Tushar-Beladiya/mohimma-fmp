import { Request, Response } from 'express';
import { fileShareService } from '../services';

export const shareFileAsPublic = async (req: Request, res: Response): Promise<void> => {
  try {
    const { filePath } = req.query;

    if (!filePath || typeof filePath !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Missing or invalid filePath parameter.',
      });
      return;
    }

    const shareUrl = await fileShareService.shareFile(filePath as string);

    res.status(200).json({
      success: true,
      message: 'File shared successfully',
      result: shareUrl,
    });
  } catch (error) {
    console.error('❌ Error sharing file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to share file',
      error: error.message,
    });
  }
};

export const shareFileAsPrivate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { filePath } = req.query;

    if (!filePath) {
      res.status(400).json({ success: false, message: 'filePath and shareWith are required' });
    }

    const shareUrl = await fileShareService.shareFileAsPrivate(filePath as string, '132');

    res.status(200).json({
      success: true,
      message: 'File shared successfully',
      result: shareUrl,
    });
  } catch (error) {
    console.error('❌ Error sharing file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to share file',
      error: error.message,
    });
  }
};
