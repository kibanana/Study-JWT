import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import config from './config';

const port = 3000;

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan('dev'));
app.set('jwt-secret', config.secret);

app.get('/', (req, res) => {
  res.send('Hello JWT');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// eslint-disable-next-line max-len
mongoose.createConnection(config.mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) {
    console.log('Connected failed');
  }
  console.log('Connected successfully to server');
});
