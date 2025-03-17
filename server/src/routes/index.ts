// src/routes/index.ts
import { Router } from 'express';
import folderRoutes from './folders.routes';
import fileRoutes from './files.routes';
import fileShareRoutes from './fileshare.routes';
import folderShareRoutes from './folderShare.routes';
import inviteUserRoutes from './inviteUser.routes';

const router = Router();

// Define base paths for different route modules
router.use('/folder', folderRoutes);
router.use('/file', fileRoutes);
router.use('/fileshare', fileShareRoutes);
router.use('/foldershare', folderShareRoutes);
router.use('/inviteuser', inviteUserRoutes);

export default router;
