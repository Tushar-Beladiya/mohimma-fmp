// src/routes/workspace.routes.ts
import { Router } from 'express';
import { fileShareController } from '../controllers';

const router = Router();

router.get('/public', fileShareController.shareFileAsPublic);
router.get('/private', fileShareController.shareFileAsPrivate);

export default router;
