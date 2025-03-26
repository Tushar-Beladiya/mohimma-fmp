// src/routes/workspace.routes.ts
import { Router } from 'express';
import { filesController } from '../controllers';
import upload from '../config/multer';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.post('/upload', authMiddleware, upload.single('file'), filesController.uploadFile);
router.get('/download', authMiddleware, filesController.downloadFile);
router.get('/preview', authMiddleware, filesController.previewFile);
router.put('/copy', authMiddleware, filesController.copyFile);
router.put('/rename', authMiddleware, filesController.renameFile);
router.delete('/delete', authMiddleware, filesController.deleteFile);

export default router;
