import express, { Express, Request, Response } from 'express';
import expressLayout from 'express-ejs-layouts';
import invitationController from './src/invitation/InvitationController';


const app: Express = express();
const port: Number = 5000;

app.set('view engine', 'ejs');
app.use(expressLayout);

app.get('/', (req: Request, res: Response) => {
    res.send('Typescript + Node.js + Express Server');
});

app.use('/invitation', invitationController);
  
app.listen(port, () => {
    console.log(`[server]: Server is running at <https://localhost>:${port}`);
});