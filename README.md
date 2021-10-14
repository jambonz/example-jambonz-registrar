# example-jambonz-registrar

This basic webhook application was created with the [create jambonz command](https://www.npmjs.com/package/create-jambonz-app) for use by [TelecomsXchange](https://telecomsxchange.com/) to enable the clients with SIP devices to register and access their SIP trunks on TCXC.

## Configuration
- SIP device registration and routing data is kept in [data/credentials.json](data/credentials.json) file.
- Webhook configuration data is kept in the [ecosystem.config.js](ecosystem.config.js) file 

## Running
```
npm install
pm2 start ecosystem.config.js
```

## Webhook Endpoints

Based on the options that you have chosen, this application exposes the following HTTP endpoints:

### /auth
Authentication webhook for sip devices.

### [/dial](lib/routes/endpoints/dial.js)
Routes calls from registered sip devices to TCXC SIP trunks

### /call-status
Call events



