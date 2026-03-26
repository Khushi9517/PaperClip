const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    // 1. Check if token exists in request headers
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token, not authorized' });
    }

    // 2. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find the user from the token's id and attach to request
    req.user = await User.findById(decoded.id).select('-password');

    // 4. Move on to the actual route
    next();

  } catch (error) {
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};

module.exports = { protect };

