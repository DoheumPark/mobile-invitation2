import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import expressLayout from 'express-ejs-layouts';
// import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import invitationController from './routes/invitation/InvitationController';


const app: Express = express();
const port = process.env.SERVER_PORT;



// app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));

app.use(expressLayout)
    .set('layout', 'layouts/layout')
    .set('layout extractScripts', true);

app.set('view engine', 'ejs')
    .set('views', path.join(__dirname, '/views'));
    // .set('views', './views');


app.get('/', (req: Request, res: Response) => {
    res.send('Typescript + Node.js + Express Server');
});

app.use('/invitation', invitationController);

app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`[server]: Server is running at <https://localhost>:${port}`);
});