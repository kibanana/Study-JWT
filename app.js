import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import config from './config';

import auth from './router/auth/router';
import user from './router/user/router';

const port = 3000;

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan('dev'));
app.set('jwt-secret', config.secret);

app.use('/auth', auth);
app.use('/', user);

app.get('/', (req, res) => {
  res.send('Hello JWT');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
