import { Router } from 'express';
import path from 'path';
import { ContainerRoutes } from './container';

const router = Router();

router.get('/', (req, res) =>
  res.status(200).sendFile(path.resolve(process.cwd(), 'src/html/index.html'))
);

router.use('/c', ContainerRoutes);

export { router as appRoutes };
