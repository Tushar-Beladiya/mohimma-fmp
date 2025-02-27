// src/routes/workspace.routes.ts
import { Router } from 'express';
import { filesController } from '../controllers';
import upload from '../config/multer';

const router = Router();

router.get('/download', filesController.downloadFile);
router.get('/preview', filesController.previewFile);
router.post('/upload', upload.single('file'), filesController.uploadFile);
router.put('/copy', filesController.copyFile);
router.put('/rename', filesController.renameFile);
router.delete('/delete', filesController.deleteFile);

export default router;
