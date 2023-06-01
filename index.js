const express = require('express');
const connectToMongo = require('./src/config/config');
const cors = require('cors');
const cookieparser = require('cookie-parser');
const userRouter = require('./src/router/user.router');
const app = express();

app.use(cookieparser());
// app.use(cors({ origin: 'https://mongodb-todolist-client.vercel.app', credentials: true }));
app.use(cors({ origin: 'https://todolist-frontend-peach.vercel.app', credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToMongo();

app.use('/', userRouter);

app.listen(9000, () => console.log('connected'));
