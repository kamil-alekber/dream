import { Router } from 'express';
import { authRoutes } from './authRoutes';

const appRoutes = Router();

appRoutes.use('/auth', authRoutes);

export { appRoutes };
