// src/routes/workspace.routes.ts
import { Router } from 'express';
import { filesController } from '../controllers';
import upload from '../config/multer';

const router = Router();

router.post('/upload', upload.single('file'), filesController.uploadFile);
router.get('/download', filesController.downloadFile);
router.delete('/delete', filesController.deleteFile);
router.put('/copy', filesController.copyFile);
router.put('/rename', filesController.renameFile);

export default router;
