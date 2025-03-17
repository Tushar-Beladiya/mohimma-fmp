import { Request, Response } from 'express';
import { inviteUserService } from '../services';

export const checkUserExists = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.query;

    if (!username || typeof username !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Missing or invalid username parameter.',
      });
      return;
    }

    const userExists = await inviteUserService.shareFolder('/Photos', username);

    res.status(200).json({
      success: true,
      message: 'User exists',
      result: userExists,
    });
  } catch (error) {
    console.error('❌ Error checking user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check user',
      error: error.message,
    });
  }
};
