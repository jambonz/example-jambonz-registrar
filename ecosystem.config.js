module.exports = {
  apps : [{
    name: 'tcxc-registrar',
    script: 'app.js',
    instance_var: 'INSTANCE_ID',
    exec_mode: 'fork',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      LOGLEVEL: 'info',
      HTTP_PORT: 80,
      JAMBONZ_ACCOUNT_SID: '<your-account-sid>',
      JAMBONZ_API_KEY: '<your-api-key>',
      JAMBONZ_REST_API_BASE_URL: 'https://api.jambonz.us/v1',
      WEBHOOK_SECRET: 'your-webhook-secret',
      OUTBOUND_SIP_HOST: 'sip01.TelecomsXChange.com'
    }
  }]
};
