const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const userRoutes = require('./api/users');
const authRoutes = require('./api/auth');
const playerRoutes = require('./api/football-players');

const app = express();

// Load environment variables
dotenv.config();

// Use body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error(err.message));

  // Import the route

// Use the route
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/football-players', playerRoutes);


// Define routes and middleware here
app.listen(process.env.PORT || 5000, () =>
  console.log(`Server listening on port ${process.env.PORT || 5000}...`)
);
