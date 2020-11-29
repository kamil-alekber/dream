import { Router } from 'express';
import path from 'path';

const authRoutes = Router();

authRoutes.route('/').get((req, res) => {
  console.log('auth route');

  res.sendFile(path.resolve(process.cwd(), 'src/html/login.html'));
});

export { authRoutes };
