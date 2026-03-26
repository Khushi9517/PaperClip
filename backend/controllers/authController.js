// 1. Import required packages and the User model
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 2. Helper function to generate a JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// 3. SIGNUP controller
const signup = async (req, res) => {
  try {
    // a. Get data sent from frontend
    const { name, email, password } = req.body;

    // b. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // c. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // d. Create and save the new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // e. Send back a success response with a token
    res.status(201).json({
      message: 'User created successfully',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
  console.error('SIGNUP ERROR:', error.message);
  console.error('FULL ERROR:', error);
  res.status(500).json({ 
    message: 'Server error', 
    error: error.message 
  });
}
}

// 4. LOGIN controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // a. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // b. Compare entered password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // c. Send back token and user info
    res.status(200).json({
      message: 'Login successful',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 5. Export both controllers
module.exports = { signup, login };