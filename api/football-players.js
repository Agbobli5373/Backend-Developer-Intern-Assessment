const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const router = express.Router();


// FootballPlayer model
const FootballPlayer = require('../models/FootballPlayer');

// JWT secret
const jwtSecret = process.env.JWT_SECRET;
//const jwtSecret = 'sdfgfhjkjh';

// Middleware to verify JWT
const verifyJwt = (req, res, next) => {
  // Get the token from the request header
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify the token
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error(err.message);
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};

// @route   POST api/football-players
// @desc    Create a new football player
// @access  Private
router.post('/', verifyJwt, async (req, res) => {
  const { name, position, team } = req.body;

  try {
    // Create a new football player
    const player = new FootballPlayer({
      name,
      position,
      team
    });

    // Save the player to the database
    await player.save();

    // Return the player object
    return res.json(player);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});


// @route   PATCH api/football-players/:id
// @desc    Update a football player's details
// @access  Private
router.patch('/:id', verifyJwt, async (req, res) => {
  const { name, position, team } = req.body;

  try {
    // Find the football player by ID
    let player = await FootballPlayer.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ msg: 'Football player not found' });
    }

    // Update the player's details
    player.name = name;
    player.position = position;
    player.team = team;

    // Save the updated player to the database
    await player.save();

    // Return the updated player object
    return res.json(player);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});


// @route   DELETE api/football-players/:id
// @desc    Delete a football player
// @access  Private
router.delete('/:id', verifyJwt, async (req, res) => {
  try {
    // Find the football player by ID and delete it
    const player = await FootballPlayer.findByIdAndDelete(req.params.id);
    if (!player) {
      return res.status(404).json({ msg: 'Football player not found' });
    }

    // Return a success message
    return res.json({ msg: 'Football player deleted' });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});



// @route   GET api/football-players
// @desc    Get all football players
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Find all football players in the database
    const players = await FootballPlayer.find();
    return res.json(players);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

module.exports = router;




