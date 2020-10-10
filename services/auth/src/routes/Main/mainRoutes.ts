import {Router} from 'express';

const router = Router();

router.route('/').get((req, res)=> res.status(200).render('index'))

export {router as MainRoutes};