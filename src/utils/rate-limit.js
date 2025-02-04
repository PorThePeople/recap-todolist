const { rateLimit } = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 100,
  message: { message: 'Too many requests --' },
});

module.exports = limiter;
