const router = require('express').Router();

router.use('/auth', require('./jwt.router'));

module.exports = router;