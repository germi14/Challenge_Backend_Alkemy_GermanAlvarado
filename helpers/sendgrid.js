
const email = require('@sendgrid/mail');

email.setApiKey(process.env.SengridApiKey);

module.exports = email;