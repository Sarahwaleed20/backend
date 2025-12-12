const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'Not authorized. Token missing.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next(); 
  } catch (error) {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid or expired token.',
    });
  }
};
