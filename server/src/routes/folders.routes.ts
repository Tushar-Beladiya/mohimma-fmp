// src/routes/workspace.routes.ts
import { Router } from 'express';
import { folderController } from '../controllers';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

//get files and folder
router.post('/', authMiddleware, folderController.createFolder);
router.get('/', authMiddleware, folderController.getFilesAndFolders);
router.delete('/', authMiddleware, folderController.deleteFolder);
router.put('/download', authMiddleware, folderController.downloadFolder);
router.put('/rename', authMiddleware, folderController.renameFolder);

export default router;
