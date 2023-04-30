const jwt = require('jsonwebtoken');
const { Unauthorized } = require('../errors');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new Unauthorized('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'secretKey');
  } catch {
    next(new Unauthorized('Необходима авторизация'));
  }

  req.user = payload;

  next();
};
