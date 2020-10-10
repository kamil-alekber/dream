import {Router} from 'express';
import { AuthRoutes } from './Auth/authRoutes';
import { MainRoutes } from './Main/mainRoutes';

const router = Router();

router.use('/', MainRoutes);
router.use('/auth', AuthRoutes);

export {router as AppRoutes};