import { Request, Response } from 'express';
import { inviteUserService } from '../services';

export const checkUserExists = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.query;
    const { folderPath } = req.body;
    if (!username || typeof username !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Missing or invalid username parameter.',
      });
      return;
    }

    const response = await inviteUserService.shareFolder(folderPath, username);
    if (response) {
      res.status(200).json({
        success: response.success,
        message: response.message,
        result: response.result,
      });
    }
  } catch (error) {
    console.error('❌ Error checking user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check user',
      error: error.message,
    });
  }
};

export const getInviteUserFolders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.query;

    if (!username || typeof username !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Missing or invalid username parameter.',
      });
      return;
    }
    const folders = await inviteUserService.getItemsSharedWithUser(username);
    if (folders) {
      res.status(200).json({
        success: true,
        message: 'User folders fetched successfully',
        result: folders,
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'No folders shared with user',
        result: [],
      });
    }
  } catch (error) {
    console.error('❌ Error fetching user folders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user folders',
      error: error.message,
    });
  }
};

// export const deleteShareUser = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { userId } = req.query;
//     if (!userId) {
//       res.status(400).json({
//         success: false,
//         message: 'Missing or invalid folderPath or username parameter.',
//       });
//       return;
//     }
//     const response = await inviteUserService.deleteShareInviteUser(userId as string);
//     res.status(200).json({
//       success: response.success,
//       message: response.message,
//       result: response.result,
//     });
//   } catch (error) {
//     console.error('❌ Error deleting share user:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to delete share user',
//       error: error.message,
//     });
//   }
// };
