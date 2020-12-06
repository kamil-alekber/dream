import { Router } from 'express';
import path from 'path';
import { ContainerRoutes } from './container';

const router = Router();

router.get('/', (req, res) => {
  console.log('inside /', req.user);

  res.status(200).sendFile(path.resolve(process.cwd(), 'src/html/index.html'));
});

router.use('/c', ContainerRoutes);

export { router as appRoutes };
