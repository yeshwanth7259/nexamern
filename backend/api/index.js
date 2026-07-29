require('dotenv').config();
const app = require('../src/app');
const connectDB = require('../src/config/database');

let isConnected = false;
if (!isConnected) {
  connectDB().then(() => {
    isConnected = true;
  }).catch(err => {
    console.error('MongoDB connection error:', err);
  });
}

module.exports = app;
