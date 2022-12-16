const mongoose = require('mongoose');

const footballPlayerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  team: {
    type: String,
    required: true
  }
});

const FootballPlayer = mongoose.model('FootballPlayer', footballPlayerSchema);

module.exports = FootballPlayer;
