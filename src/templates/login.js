var botBuilder = require('claudia-bot-builder'),
    fbTemplate = botBuilder.fbTemplate
    utils = require('../utils')

function loginTemplate(name){
  const generic = new fbTemplate.Generic();
        generic.addBubble(`Hi ${name}! I am Zen.`, 'Welcome to ZF Chat! Please login to continue.')
        .addLoginButton('https://zenforce.zennerslab.com/login')
  return generic.get()
}

module.exports = {
  loginTemplate: loginTemplate
}
