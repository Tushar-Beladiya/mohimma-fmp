// src/routes/workspace.routes.ts
import { Router } from 'express';
import { inviteUserController } from '../controllers';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

//get files and folder
router.get('/', authMiddleware, inviteUserController.inviteUser);
router.get('/shared', authMiddleware, inviteUserController.getSharedData);
router.get('/users', authMiddleware, inviteUserController.getUsers);
router.delete('/', authMiddleware, inviteUserController.deleteShareUser);
router.put('/', authMiddleware, inviteUserController.updateShareUser);
router.delete('/user', authMiddleware, inviteUserController.deleteUser);

export default router;
