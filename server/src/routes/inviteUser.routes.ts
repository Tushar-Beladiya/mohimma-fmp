// src/routes/workspace.routes.ts
import { Router } from 'express';
import { inviteUserController } from '../controllers';

const router = Router();

//get files and folder
router.get('/', inviteUserController.inviteUser);
router.get('/shared', inviteUserController.getSharedData);
router.get('/users', inviteUserController.getUsers);
router.delete('/', inviteUserController.deleteShareUser);
router.put('/', inviteUserController.updateShareUser);
router.delete('/user', inviteUserController.deleteUser);

export default router;
