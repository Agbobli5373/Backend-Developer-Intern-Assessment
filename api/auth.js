const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();


// User model
const User = require('../models/User');

// JWT secret
const jwtSecret = process.env.JWT_SECRET;
//const jwtSecret = 'sdfgfhjkjh';

// @route   POST api/auth/signin
// @desc    Authenticate a user
// @access  Public
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Compare the provided password to the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // If the user is authenticated successfully, generate a JWT
    const payload = {
      user: {
        id: user.id
      }
    };
    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: '1h'
    });

    // Return the JWT in the response
    return res.json({ token });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

// @route   POST api/auth/logout
// @desc    Logout a user
// @access  Private
router.post('/logout', (req, res) => {
    // Clear the user's authentication token from their session
    req.logout();
    return res.send('User logged out');
  });

module.exports = router;
