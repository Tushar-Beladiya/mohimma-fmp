// src/routes/workspace.routes.ts
import { Router } from 'express';
import { filesController } from '../controllers';
import upload from '../config/multer';

const router = Router();

router.post('/upload', upload.single('file'), filesController.uploadFile);
router.get('/download', filesController.downloadFile);

export default router;
