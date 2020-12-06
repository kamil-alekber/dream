import { Router } from 'express';
import path from 'path';
import { ContainerRoutes } from './container';

const appRoutes = Router();

appRoutes.get('/', (req, res) => {
  console.log('inside /', req.user);

  res.status(200).sendFile(path.resolve(process.cwd(), 'src/html/index.html'));
});

appRoutes.use('/c', ContainerRoutes);

export { appRoutes };
