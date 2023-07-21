import express, { Express, Request, Response, Router } from 'express';
const router: Router = express.Router();

router.get('/create', async(req: Request, res: Response) => {
    res.json('test');
});


module.exports = router;