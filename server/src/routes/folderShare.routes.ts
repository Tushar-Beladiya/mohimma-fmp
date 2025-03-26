// src/routes/workspace.routes.ts
import { Router } from 'express';
import { folderShareController } from '../controllers';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.get('/public', authMiddleware, folderShareController.shareFolderAsPublic);
router.get('/private', authMiddleware, folderShareController.shareFolderAsPrivate);

export default router;
