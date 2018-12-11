var botBuilder = require('claudia-bot-builder'),
    login = require('./src/api/login'),
    tasks = require('./src/api/tasks'),
    shared = require('./src/api/shared'),
    templates = require('./src/templates'),
    utils = require('./src/utils'),
    data = require('./src/utils/data'),
    loginTemplates = require('./src/templates/login'),
    taskTemplates = require('./src/templates/tasks')

function getAttachment(attachments){
  return attachments.map(attachment => {
    switch (attachment.type) {
      case 'location':
        console.log('location: ', attachment.payload.coordinates)
        return JSON.stringify(attachment.payload.coordinates)
        break;
      default:
        return attachment.type
    }
  })
}

module.exports = botBuilder(function (request) {
  var { text, sender } = request
      text = text.split('-')[0].toLowerCase()
  if(text === 'tasklist'){
    return templates.dateTemplate()
  }else if(text === 'complete' || text === 'checkin' || text === 'view'){
    const task_id = utils.getParamsValue(request.text)
    return tasks.singleTaskActions(sender, text, task_id)
  }else if(text === 'yesterday' || text === 'today' || text === 'tomorrow'){
    return tasks.fetchTaskList(sender, text)
  }else if(text === 'logout'){
    return login.logOut(sender)
  }else if(text === ''){
    console.log('originalRequest: ', request.originalRequest)
    if(request.originalRequest.account_linking){
      if(request.originalRequest.account_linking.status === 'linked'){
        const auth = request.originalRequest.account_linking.authorization_code
        return login.saveUserToken(auth, sender)
      }
    }else if(request.originalRequest.message){
      if(request.originalRequest.message.attachments){
        return getAttachment(request.originalRequest.message.attachments)
      }
    }
  }else {
    console.log('request: ', request)
    return login.checkToken(sender)
  }
});
