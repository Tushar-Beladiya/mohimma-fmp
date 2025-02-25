// src/routes/workspace.routes.ts
import { Router } from 'express';
import { folderController } from '../controllers';

const router = Router();

//get files and folder
router.get('/', folderController.getFilesAndFolders);
router.post('/', folderController.createFolder);
router.delete('/', folderController.deleteFolder);
router.put('/download', folderController.downloadFolder);
router.put('/rename', folderController.renameFolder);

export default router;
