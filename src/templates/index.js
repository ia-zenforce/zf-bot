var botBuilder = require('claudia-bot-builder'),
    fbTemplate = botBuilder.fbTemplate
    utils = require('../utils')

function dateTemplate(){
  const generic = new fbTemplate.Generic();
        generic.addBubble('Select Task Date', `Choose what tasks to view.`)
        .addButton('Yesterday', `yesterday`)
        .addButton('Today', `today`)
        .addButton('Tomorrow', `tomorrow`)

  return generic.get()
}

function signedInTemplate(name){
  const generic = new fbTemplate.Generic();
        generic.addBubble(`Hi ${name}! I am Zen.`, 'Welcome, how may I help you?')
        .addButton('View Tasks', 'tasklist')
        .addButton('Logout', 'logout')
  return generic.get()
}

module.exports = {
  dateTemplate: dateTemplate,
  signedInTemplate: signedInTemplate
}
