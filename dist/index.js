"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const express_ejs_layouts_1 = __importDefault(require("express-ejs-layouts"));
// import dotenv from 'dotenv';
dotenv_1.default.config();
const path_1 = __importDefault(require("path"));
const InvitationController_1 = __importDefault(require("./routes/invitation/InvitationController"));
const app = (0, express_1.default)();
const port = process.env.SERVER_PORT;
// app.use(express.json());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use(express_ejs_layouts_1.default)
    .set('layout', 'layouts/layout')
    .set('layout extractScripts', true);
app.set('view engine', 'ejs')
    .set('views', path_1.default.join(__dirname, '/views'));
// .set('views', './views');
app.get('/', (req, res) => {
    res.send('Typescript + Node.js + Express Server');
});
app.use('/invitation', InvitationController_1.default);
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`[server]: Server is running at <https://localhost>:${port}`);
});
