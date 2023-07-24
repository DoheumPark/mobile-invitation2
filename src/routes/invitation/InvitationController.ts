import express, { Express, Request, Response, Router } from 'express';
const router: Router = express.Router();

router.get('/create', async(req: Request, res: Response) => {
    res.render('invitation/create', { title: '하하하' });
});


export default router;