// src/routes/index.ts
import { Router } from 'express';
import folderRoutes from './folders.routes';
import fileRoutes from './files.routes';
import fileShareRoutes from './fileshare.routes';

const router = Router();

// Define base paths for different route modules
router.use('/folder', folderRoutes);
router.use('/file', fileRoutes);
router.use('/fileshare', fileShareRoutes);

export default router;
