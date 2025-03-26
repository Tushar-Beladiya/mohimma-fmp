// src/routes/index.ts
import { Router } from 'express';
import folderRoutes from './folders.routes';
import fileRoutes from './files.routes';
import fileShareRoutes from './fileshare.routes';
import folderShareRoutes from './folderShare.routes';
import inviteUserRoutes from './inviteUser.routes';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

// Define base paths for different route modules
router.use('/folder', authMiddleware, folderRoutes);
router.use('/file', authMiddleware, fileRoutes);
router.use('/fileshare', authMiddleware, fileShareRoutes);
router.use('/foldershare', authMiddleware, folderShareRoutes);
router.use('/inviteuser', authMiddleware, inviteUserRoutes);

export default router;
