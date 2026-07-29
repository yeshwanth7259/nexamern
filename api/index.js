require('dotenv').config();
const app = require('../backend/src/app');
const connectDB = require('../backend/src/config/database');

let isConnected = false;
if (!isConnected) {
  connectDB().then(() => {
    isConnected = true;
  }).catch(err => {
    console.error('MongoDB connection error:', err);
  });
}

module.exports = app;
