// src/routes/workspace.routes.ts
import { Router } from 'express';
import { inviteUserController } from '../controllers';

const router = Router();

//get files and folder
router.get('/', inviteUserController.checkUserExists);
router.get('/user', inviteUserController.getInviteUserFolders);
// router.delete('/', inviteUserController.deleteShareUser);

export default router;
