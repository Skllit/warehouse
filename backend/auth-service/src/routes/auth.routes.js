const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');
const validate = require('../validators/auth.validator');
const User = require('../models/user.model');
const authMiddleware = require('../middlewares/auth.middleware');
const { ROLES } = require('../config/constants');

router.post('/register', validate.register, register);
router.post('/login', validate.login, login);

router.get('/users', authMiddleware, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const users = await User.find({}, 'username email role');
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// ✅ UPDATE USER ROLE
router.put('/users/:id/role', authMiddleware, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { role } = req.body;
    if (!Object.values(ROLES).includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Role updated', user });
  } catch (err) {
    next(err);
  }
});

// ✅ DELETE USER
router.delete('/users/:id', authMiddleware, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const result = await User.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    next(err);
  }
});



router.get('/roles', (req, res) => {
  res.json(Object.values(ROLES)); // return array of roles
});


module.exports = router;