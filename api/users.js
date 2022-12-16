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

// @route   POST api/users/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save the user to the database
    await user.save();

    // Generate a JWT for the new user
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

module.exports = router;
