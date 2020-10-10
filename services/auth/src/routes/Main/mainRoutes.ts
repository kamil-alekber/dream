import {Router} from 'express';

const router = Router();

router.route('/').get((req, res)=> res.status(200).render('pages/index', {title: 'Auth Service', serverUrl: process.env.serverUrl, workerUrl: process.env.workerUrl, webUrl: process.env.webUrl}))

export {router as MainRoutes};