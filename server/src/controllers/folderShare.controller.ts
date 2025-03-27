import { Request, Response } from 'express';
import HttpError from '../helpers/error';
import { folderShareService } from '../services';

export const shareFolderAsPublic = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { folderPath } = req.query;

    if (!folderPath || typeof folderPath !== 'string') {
      throw new HttpError(422, 'Missing or invalid folderPath parameter.');
    }

    const shareUrl = await folderShareService.shareFolderAsPublic(folderPath as string);

    return res.status(200).json({
      success: true,
      message: 'Folder shared successfully',
      result: shareUrl,
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
      message: 'Failed to share folder',
      error: err.message,
    });
  }
};

export const shareFolderAsPrivate = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { folderPath, password } = req.query;

    if (!folderPath && !password) {
      throw new HttpError(422, 'folderPath and password are required');
    }

    //VALIDATION FOR STRONG PASSWORD THAT WOULD BE CHARACTER, SPACIAL CHARATER, NUMBER, AND MINIMUM OF 8 CHARACTERS like it would be StrongP@ssw0rd!

    const passwordRegex = new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$');
    if (!passwordRegex.test(password as string)) {
      throw new HttpError(422, 'Password must contain at least 8 characters, one letter, one number and one special character');
    }

    const shareUrl = await folderShareService.shareFolderAsPrivate(folderPath as string, password as string);

    return res.status(200).json({
      success: true,
      message: 'Folder shared successfully',
      result: shareUrl,
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
      message: 'Failed to share folder',
      error: err.message,
    });
  }
};
