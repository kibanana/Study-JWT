/* eslint-disable no-underscore-dangle */
import express from 'express';
import jwt from 'jsonwebtoken';

import authMiddleware from '../../middlewares/authorization';
import User from '../../models/user';

const router = express.Router();

router.post('/register', (req, res) => {
  const { username, password } = req.body;
  let newUser;

  const create = (user) => {
    console.log(user);
    if (user) {
      throw new Error('username exists');
    } else {
      return User.create(username, password);
    }
  };

  const count = (user) => {
    console.log(user);
    newUser = user;
    return User.count({}).exec();
  };

  const assign = (cnt) => {
    console.log(cnt);
    if (cnt === 1) {
      return newUser.assignAdmin();
    }
    // if not, return a promise that returns false
    return Promise.resolve(false);
  };

  const response = (isAdmin) => {
    console.log(isAdmin);
    res.json({
      message: 'registered successfully',
      // eslint-disable-next-line no-unneeded-ternary
      admin: isAdmin ? true : false,
    });
  };

  const onError = (error) => {
    res.status(409).json({
      message: error.message,
    });
  };

  User.findOneByUsername(username)
    .then((user) => create(user))
    .then((user) => count(user))
    .then((cnt) => assign(cnt))
    .then((user) => response(user))
    .catch(onError);
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const secret = req.app.get('jwt-secret');

  const check = (user) => {
    if (!user) {
      throw new Error('login failed!');
    } else {
      // eslint-disable-next-line no-lonely-if
      if (user.verify(password)) {
        const p = new Promise((resolve, reject) => {
          jwt.sign(
            {
              _id: user._id,
              username: user.username,
              admin: user.admin,
            },
            secret,
            {
              expiresIn: '1d',
              issuer: 'woni',
              subject: 'userStatus',
            }, (err, token) => {
              if (err) reject(err);
              else resolve(token);
            },
          );
        });
        return p;
      // eslint-disable-next-line no-else-return
      } else {
        throw new Error('login failed!');
      }
    }
  };

  const response = (token) => {
    res.json({
      message: 'login was suceessful!',
      token,
    });
  };

  const onError = (error) => {
    res.status(403).json({
      message: error.message,
    });
  };

  User.findOneByUsername(username)
    .then((user) => check(user))
    .then((user) => response(user))
    .catch((err) => onError(err));
});

router.use('/check', authMiddleware);

// Header의 x-access-token 또는
// URI에 queryString의 token값으로 넘긴다
// eslint-disable-next-line consistent-return
router.get('/check', (req, res) => {
  res.json({
    success: true,
    info: req.decoded,
  });
});

export default router;
