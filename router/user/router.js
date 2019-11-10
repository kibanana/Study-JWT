import express from 'express';
import User from '../../models/user';

const router = express.Router();

router.post('/register', (req, res) => {
  res.send('This is register page');
});

export default router;
