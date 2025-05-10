// const User = require('../models/user.model');
// const { hashPassword, comparePassword } = require('../utils/hash');
// const { generateToken } = require('../utils/jwt');

// exports.register = async ({ username, email, password, role }) => {
//   const existing = await User.findOne({ $or: [{ email }, { username }] });
//   if (existing) throw new Error('User already exists');
//   const hashed = await hashPassword(password);
//   const user = await User.create({ username, email, password: hashed, role });
//   return { message: 'User registered successfully', user: { id: user._id, username: user.username, role: user.role } };
// };

// exports.login = async ({ email, password }) => {
//   const user = await User.findOne({ email });
//   if (!user) throw new Error('Invalid credentials');
//   const isValid = await comparePassword(password, user.password);
//   if (!isValid) throw new Error('Invalid credentials');
//   const token = generateToken({ id: user._id, role: user.role });
//   return { message: 'Login successful', token };
// };

const User = require('../models/user.model');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');

exports.register = async ({ username, email, password, confirmPassword, role }) => {
  if (password !== confirmPassword) {
    throw new Error('Passwords do not match');
  }

  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) throw new Error('User already exists');

  const hashed = await hashPassword(password);
  const user = await User.create({  username, email, password: hashed, role });

  return {
    message: 'User registered successfully',
    user: {
      id: user._id,
      username: user.username,
      role: user.role
    }
  };
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');

  const isValid = await comparePassword(password, user.password);
  if (!isValid) throw new Error('Invalid credentials');

  const token = generateToken({ id: user._id, role: user.role });

  return {
    message: 'Login successful',
    token
  };
};
