const router = require('express').Router();

router.post('/', async(req, res) => {
  const {logger, calculateResponse, getUserInfo} = req.app.locals;
  try {
    const {realm, username} = req.body;
    const user = getUserInfo(username, realm);

    if (!user) {
      logger.info(`rejecting auth attempt for unknown user ${username}@${realm}`);
      return res.status(200).json({status: 'fail', msg: 'unknown user or realm'});
    }

    const {password} = user;
    const myResponse = calculateResponse(req.body, password);
    if (myResponse === req.body.response) {
      logger.info({payload: req.body}, 'sip user successfully authenticated');
      return res.json({status: 'ok'});
    }
    logger.info(`invalid password supplied for ${username}`);
    return res.status(200).json({status: 'fail', msg: 'invalid password'});
  } catch (err) {
    logger.error({err}, 'Error authenticating');
    res.send({status: 'fail', msg: err.message});
  }
});

module.exports = router;
