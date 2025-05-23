// src/routes/workspace.routes.ts
import { Router } from 'express';
import { folderShareController } from '../controllers';

const router = Router();

router.get('/public', folderShareController.shareFolderAsPublic);
router.get('/private', folderShareController.shareFolderAsPrivate);
router.get('/shared/:token', folderShareController.getSharedFolderContents);

export default router;
