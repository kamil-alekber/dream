import { Router } from 'express';
import path from 'path';

const router = Router();

router.get('/', (req, res) =>
  res.status(200).sendFile(path.resolve(process.cwd(), 'src/html/index.html'))
);

export { router as appRoutes };
