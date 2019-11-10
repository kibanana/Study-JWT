import express from 'express';

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
    .then((user) => {
      return create(user);
    })
    .then((user) => {
      return count(user);
    })
    .then((cnt) => {
      return assign(cnt);
    })
    .then((user) => {
      return response(user);
    })
    .catch(onError);
});

export default router;
