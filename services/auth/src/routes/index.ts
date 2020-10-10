import {Router} from 'express';
import { MainRoutes } from './Main/mainRoutes';
const router = Router();

router.use('/', MainRoutes);

export {router as AppRoutes};