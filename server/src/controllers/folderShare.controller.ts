import { Request, Response } from 'express';
import { folderShareService } from '../services';

export const shareFolderAsPublic = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { folderPath } = req.query;

    if (!folderPath || typeof folderPath !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Missing or invalid folderPath parameter.',
      });
    }

    const shareUrl = await folderShareService.shareFolderAsPublic(folderPath as string);

    return res.status(200).json({
      success: true,
      message: 'Folder shared successfully',
      result: shareUrl,
    });
  } catch (error) {
    console.error('❌ Error sharing folder:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to share folder',
      error: error.message,
    });
  }
};

export const shareFolderAsPrivate = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { folderPath, password } = req.query;

    if (!folderPath && !password) {
      return res.status(400).json({ success: false, message: 'folderPath and password are required' });
    }

    //VALIDATION FOR STRONG PASSWORD THAT WOULD BE CHARACTER, SPACIAL CHARATER, NUMBER, AND MINIMUM OF 8 CHARACTERS like it would be StrongP@ssw0rd!

    const passwordRegex = new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$');
    if (!passwordRegex.test(password as string)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least 8 characters, one letter, one number and one special character',
      });
    }

    const shareUrl = await folderShareService.shareFolderAsPrivate(folderPath as string, password as string);

    return res.status(200).json({
      success: true,
      message: 'Folder shared successfully',
      result: shareUrl,
    });
  } catch (error) {
    console.error('❌ Error sharing folder:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to share folder',
      error: error.message,
    });
  }
};
