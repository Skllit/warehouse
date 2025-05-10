// const authService = require('../services/auth.service');

// exports.register = async (req, res, next) => {
//   try {
//     const result = await authService.register(req.body);
//     res.status(201).json(result);
//   } catch (err) {
//     next(err);
//   }
// };

// exports.login = async (req, res, next) => {
//   try {
//     const result = await authService.login(req.body);
//     res.status(200).json(result);
//   } catch (err) {
//     next(err);
//   }
// };

const authService = require('../services/auth.service');

exports.register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
