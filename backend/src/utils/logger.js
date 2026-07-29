const winston = require('winston');

const transports = [];

if (process.env.NODE_ENV === 'production') {
  // In production (Vercel), only log to console because the filesystem is read-only
  transports.push(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    )
  }));
} else {
  // In development, log to files and console
  transports.push(new winston.transports.File({ filename: 'logs/error.log', level: 'error' }));
  transports.push(new winston.transports.File({ filename: 'logs/combined.log' }));
  transports.push(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: transports,
});

module.exports = logger;
