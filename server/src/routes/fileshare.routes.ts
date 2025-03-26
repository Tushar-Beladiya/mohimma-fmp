// src/routes/workspace.routes.ts
import { Router } from 'express';
import { fileShareController } from '../controllers';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.get('/public', authMiddleware, fileShareController.shareFileAsPublic);
router.get('/private', authMiddleware, fileShareController.shareFileAsPrivate);

export default router;
