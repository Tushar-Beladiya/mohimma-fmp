import { Request, Response } from 'express';
import { fileShareService } from '../services';
import HttpError from '../helpers/error';

export const shareFileAsPublic = async (req: Request, res: Response): Promise<void> => {
  try {
    const { filePath } = req.query;

    if (!filePath || typeof filePath !== 'string') {
      throw new HttpError(404, 'Missing or invalid filePath parameter.');
    }

    const shareUrl = await fileShareService.shareFile(filePath as string);

    res.status(200).json({
      success: true,
      message: 'File shared successfully',
      result: shareUrl,
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
      message: 'Failed to share file',
      error: err.message,
    });
  }
};

export const shareFileAsPrivate = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { filePath, password } = req.query;

    if (!filePath && !password) {
      throw new HttpError(422, 'filePath and password are required');
    }

    //VALIDATION FOR STRONG PASSWORD THAT WOULD BE CHARACTER, SPACIAL CHARATER, NUMBER, AND MINIMUM OF 8 CHARACTERS like it would be StrongP@ssw0rd!

    const passwordRegex = new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$');
    if (!passwordRegex.test(password as string)) {
      throw new HttpError(422, 'Password must contain at least 8 characters, one letter, one number and one special character');
    }

    const shareUrl = await fileShareService.shareFileAsPrivate(filePath as string, password as string);

    return res.status(200).json({
      success: true,
      message: 'File shared successfully',
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
      message: 'Failed to share file',
      error: err.message,
    });
  }
};
