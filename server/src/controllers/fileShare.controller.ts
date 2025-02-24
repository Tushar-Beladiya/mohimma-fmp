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

export const shareFileAsPrivate = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { filePath, password } = req.query;

    if (!filePath && !password) {
      return res.status(400).json({ success: false, message: 'filePath and password are required' });
    }

    //VALIDATION FOR STRONG PASSWORD THAT WOULD BE CHARACTER, SPACIAL CHARATER, NUMBER, AND MINIMUM OF 8 CHARACTERS like it would be StrongP@ssw0rd!

    const passwordRegex = new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$');
    if (!passwordRegex.test(password as string)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least 8 characters, one letter, one number and one special character',
      });
    }

    const shareUrl = await fileShareService.shareFileAsPrivate(filePath as string, password as string);

    return res.status(200).json({
      success: true,
      message: 'File shared successfully',
      result: shareUrl,
    });
  } catch (error) {
    console.error('❌ Error sharing file:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to share file',
      error: error.message,
    });
  }
};
