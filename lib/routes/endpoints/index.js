const router = require('express').Router();

router.use('/call-status', require('./call-status'));
router.use('/dial', require('./dial'));
router.use('/auth', require('./auth'));

module.exports = router;
