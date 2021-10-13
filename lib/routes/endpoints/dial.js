const router = require('express').Router();
const {WebhookResponse} = require('@jambonz/node-client');




// SIP Trunk Details for SIP user chile
	// username: FsysPT14
	// password: oDuQRlTM
	//const techPrefix = '444924#'; // Tech Prefix for SIP user Chile
	//callerId: '+96265923360',  // userd when calling to all destinations
	// This client will try to dial with 00 , if possible to add a rule to strip the 00


// SIP Trunk Details for SIP user Raw3a
        // username: 5Ztn0Ov5
        // password: ZXkdRafZ
        //const techPrefix = '444242#'; // Tech Prefix for SIP user Raw3a
        //callerId: '+96824706499', // default caller id used when dialing all  destinations except Saudi, UAE
	//Saudi_CLID: '+97145205106', // Use this caller id when dialing to Saudi Arabia number starting with 966
        //UAE_CLID: '+966920027447', // Use this caller id when dialing to Saudi Arabia number starting with 971	
	// This client will try to dial with + before the number , if possible to add a rule to strip the + incase used




const techPrefix = '444242#'; //Raw3a Account

router.post('/', (req, res) => {
  const {logger} = req.app.locals;
  logger.debug({payload: req.body}, 'POST /dial-time');
  try {
    const app = new WebhookResponse();
    app
      .dial({
        callerId: '+96824706499', 
        answerOnBridge: true,
        //actionHook: '/dial-action',
        target: [
          {
            type: 'sip',
            sipUri: `sip:${techPrefix}${req.body.to}@sip01.TelecomsXChange.com`,
            auth: {
             // The below SIP trunk credins are dedicated for SIP user Raw3a define in data/credentials.json 
	      username: '5Ztn0Ov5', // For user Raw3a
              password: 'ZXkdRafZ'  // For user Raw3a
            }
          }
        ]
      });
    res.status(200).json(app);
  } catch (err) {
    logger.error({err}, 'Error');
    res.sendStatus(503);
  }
});

module.exports = router;
