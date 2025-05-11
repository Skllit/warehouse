const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');
const validate = require('../validators/auth.validator');
const User = require('../models/user.model');
const authMiddleware = require('../middlewares/auth.middleware');
const { ROLES } = require('../config/constants');

router.post('/register', validate.register, register);
router.post('/login', validate.login, login);

// Get all users (admin only)
router.get('/users', authMiddleware, async (req, res, next) => {
  try {
    if (req.user.role !== ROLES.ADMIN) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const users = await User.find({}, 'username email role');
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// Get user details (admin only)
router.get('/users/:id', authMiddleware, async (req, res, next) => {
  try {
    if (req.user.role !== ROLES.ADMIN) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const user = await User.findById(req.params.id, 'username email role');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// Update user role (admin only)
router.put('/users/:id/role', authMiddleware, async (req, res, next) => {
  try {
    if (req.user.role !== ROLES.ADMIN) {
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

// Delete user (admin only)
router.delete('/users/:id', authMiddleware, async (req, res, next) => {
  try {
    if (req.user.role !== ROLES.ADMIN) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const result = await User.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    next(err);
  }
});

// Get all roles (admin only)
router.get('/roles', authMiddleware, async (req, res, next) => {
  try {
    if (req.user.role !== ROLES.ADMIN) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(Object.values(ROLES));
  } catch (err) {
    next(err);
  }
});

// Create new role (admin only)
router.post('/roles', authMiddleware, async (req, res, next) => {
  try {
    if (req.user.role !== ROLES.ADMIN) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { role } = req.body;
    if (!role || typeof role !== 'string') {
      return res.status(400).json({ message: 'Invalid role format' });
    }
    if (Object.values(ROLES).includes(role)) {
      return res.status(400).json({ message: 'Role already exists' });
    }
    // Add new role to ROLES object
    ROLES[role.toUpperCase()] = role.toLowerCase();
    res.status(201).json({ message: 'Role created', role });
  } catch (err) {
    next(err);
  }
});

// Update role (admin only)
router.put('/roles/:oldRole', authMiddleware, async (req, res, next) => {
  try {
    if (req.user.role !== ROLES.ADMIN) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { newRole } = req.body;
    const { oldRole } = req.params;
    
    if (!Object.values(ROLES).includes(oldRole)) {
      return res.status(404).json({ message: 'Role not found' });
    }
    if (!newRole || typeof newRole !== 'string') {
      return res.status(400).json({ message: 'Invalid role format' });
    }
    if (Object.values(ROLES).includes(newRole)) {
      return res.status(400).json({ message: 'New role already exists' });
    }

    // Update role in ROLES object
    const roleKey = Object.keys(ROLES).find(key => ROLES[key] === oldRole);
    if (roleKey) {
      ROLES[roleKey] = newRole.toLowerCase();
    }

    // Update role for all users with the old role
    await User.updateMany({ role: oldRole }, { role: newRole.toLowerCase() });

    res.json({ message: 'Role updated', oldRole, newRole });
  } catch (err) {
    next(err);
  }
});

module.exports = router;