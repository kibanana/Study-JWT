import express from 'express';
import authMiddleware from '../../middlewares/authorization';
import User from '../../models/user';

const router = express.Router();

router.use('/users/*', authMiddleware);

// eslint-disable-next-line consistent-return
router.get('/users', (req, res) => {
  if (!req.decoded.admin) {
    return res.status(403).json({
      message: 'This account doesn\'t have admin permission!',
    });
  }

  User.find({})
    .then((users) => res.json({ users }));
});

// eslint-disable-next-line consistent-return
router.post('/users/admin/:name', (req, res) => {
  if (!req.decoded.admin) {
    return res.status(403).json({
      message: 'This account doesn\'t have admin permission!',
    });
  }

  User.findOneByUsername(req.params.name)
    .then((adminUser) => adminUser.assignAdmin())
    .then(() => res.json({
      success: true,
    }));
});

export default router;
