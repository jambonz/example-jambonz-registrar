const router = require('express').Router();
const {WebhookResponse} = require('@jambonz/node-client');

const normalizeDest = (dest) => {
  if (dest.startsWith('+')) return dest.slice(1);
  if (dest.startsWith('00')) return dest.slice(2);
  return dest;
};

const getCallerId = (logger, user, dest) => {
  const {callerId} = user;
  logger.debug({user, callerId}, `searching for caller id on call to ${dest}`);
  if (typeof callerId === 'string') return callerId;
  if (typeof callerId === 'object') {
    for (const pattern of callerId.patterns) {
      const {match, callerId} = pattern;
      logger.debug(`checking match ${match}`);
      if (dest.match(match)) {
        logger.debug(`using callerId ${callerId} based on match ${match}`);
        return callerId;
      }
    }
    logger.debug(`using default callerId ${callerId.default}`);
    return callerId.default;
  }
};

router.post('/', (req, res) => {
  const {logger, getUserInfo} = req.app.locals;
  const hdrs = req.body?.sip?.headers;
  const aor = hdrs ? hdrs['X-Authenticated-User'] : null;
  logger.debug({aor, payload: req.body}, 'POST /dial');

  try {
    const app = new WebhookResponse();
    if (!aor) {
      logger.info({payload: req.body},
        'rejecting call received from a Carrier (this is a sip device calling app only');
      app.sip_decline({status: 503});
    }
    else {
      const user = getUserInfo(aor);
      if (!user) {
        logger.info({payload: req.body},
          'rejecting call because it was not placed by one of our known users');
        app.sip_decline({status: 503});
      }
      else {
        const dest = normalizeDest(req.body.to);
        const callerId = getCallerId(logger, user, dest);
        const techPrefix = user.techPrefix || '';
        const auth = user.outboundAuth;
        app
          .dial({
            callerId,
            answerOnBridge: true,
            target: [
              {
                type: 'sip',
                sipUri: `sip:${techPrefix}${dest}@${process.env.OUTBOUND_SIP_HOST}`,
                auth
              }
            ]
          });
      }
    }
    res.status(200).json(app);
  } catch (err) {
    logger.error({err}, 'Error');
    res.sendStatus(503);
  }
});

module.exports = router;
