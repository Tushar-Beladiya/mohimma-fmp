import { Request, Response } from 'express';
import HttpError from '../helpers/error';
import { inviteUserService } from '../services';

export const inviteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, folderPath } = req.query;
    if (!username) {
      throw new HttpError(400, 'Missing or invalid username parameter.');
    }

    const response = await inviteUserService.inviteUser(folderPath as string, username as string);
    if (response) {
      res.status(200).json({
        success: true,
        message: 'User invited successfully',
        result: response,
      });
    }
  } catch (err) {
    if (err instanceof HttpError) {
      res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
    }
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getSharedData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, path } = req.query;

    // Fetch shared folders based on available parameters
    const response = await inviteUserService.getSharedData(username as string, path as string);

    res.status(200).json({
      success: true,
      message: 'User folders fetched successfully',
      result: response,
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
      message: err.message,
    });
  }
};

export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const response = await inviteUserService.getUsers();

    res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      result: response,
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
      message: err,
    });
  }
};

export const deleteShareUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shareId, shareWith } = req.query;
    // Validate userId
    if (!shareId) {
      throw new HttpError(400, 'Missing or invalid userId parameter.');
    }

    // Call service function to delete the share
    const response = await inviteUserService.deleteShareItem(Number(shareId), shareWith as string);

    res.status(200).json({
      success: true,
      message: 'Share deleted successfully',
      result: response,
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
      message: err.message,
    });
  }
};

export const updateShareUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shareId, permission } = req.body;

    if (!shareId) {
      throw new HttpError(400, 'Missing or  invalid shareId  parameter.');
    }

    const response = await inviteUserService.updateSharePermission(shareId, permission);

    res.status(200).json({
      success: true,
      message: 'Share updated successfully',
      result: response,
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
      message: 'Internal Server Error: Failed to update share user',
      error: err.message,
    });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.query;

    // Validate userId
    if (!userId) {
      throw new HttpError(400, 'Missing or invalid shareId  parameter.');
    }

    // Call service function to delete the share
    const response = await inviteUserService.deleteUser(userId as string);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      result: response,
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
      message: err.message,
    });
  }
};
