import { Request, Response } from 'express';
import { inviteUserService } from '../services';

export const inviteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, folderPath } = req.query;
    if (!username) {
      res.status(400).json({
        success: false,
        message: 'Missing or invalid username parameter.',
      });
      return;
    }

    const response = await inviteUserService.InviteUser(folderPath as string, username as string);
    if (response) {
      res.status(200).json({
        success: response.success,
        message: response.message,
        result: response.result,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSharedData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, path } = req.query;

    // Fetch shared folders based on available parameters
    const response = await inviteUserService.getSharedData(username as string, path as string);
    if (response.success) {
      res.status(200).json({
        success: true,
        message: 'User folders fetched successfully',
        result: response.result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'No shared folders found',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteShareUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shareId } = req.query;
    const { shareWith } = req.body;
    // Validate userId
    if (!shareId) {
      res.status(400).json({
        success: false,
        message: 'Missing or invalid userId parameter.',
      });
    }

    // Call service function to delete the share
    const response = await inviteUserService.deleteShareItem(shareId as string, shareWith);

    if (response.success) {
      res.status(200).json({
        success: true,
        message: 'Share deleted successfully',
        result: response.result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: response.message || 'Share not found or could not be deleted',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateShareUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shareId, permission } = req.body;

    // Validate input
    if (!shareId) {
      res.status(400).json({
        success: false,
        message: 'Missing or invalid shareId parameter.',
      });
      return;
    }

    // Call service function to update the share
    const response = await inviteUserService.updateShareInviteUser(shareId, permission);

    if (response.success) {
      res.status(200).json({
        success: true,
        message: 'Share updated successfully',
        result: response.result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: response.message || 'Share not found or could not be updated',
      });
    }
  } catch (error) {
    console.error('❌ Error updating share user:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error: Failed to update share user',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.query;

    // Validate userId
    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'Missing or invalid userId parameter.',
      });
    }

    // Call service function to delete the share
    const response = await inviteUserService.deleteUser(userId as string);

    if (response.success) {
      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
        result: response.result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: response.message || 'User not found or could not be deleted',
      });
    }
  } catch (error) {
    console.error('❌ Error deleting share user:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
