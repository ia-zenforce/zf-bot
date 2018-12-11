const rp = require('minimal-request-promise')
      templates = require('../templates/tasks')
      utils = require('../utils')
      config = require('../../config')
      moment = require('moment')
      shared = require('./shared')
      jwt = require('jwt-decode')

const { facebookAccessToken, apiGetway, awsUrl, apiUrl } = config

function fetchTaskList(sender, date){
  const today = new Date()
  const dateObj = {
    today: today,
    tomorrow: new Date(new Date(today).setDate(today.getDate() + 1)),
    yesterday: new Date(new Date(today).setDate(today.getDate() - 1))
  }

  const selectedDay = dateObj[date]
  const start_date = moment(selectedDay).startOf('day').format('YYYY-MM-DD HH:mm:ss')
  const end_date = moment(selectedDay).endOf('day').format('YYYY-MM-DD HH:mm:ss')

  return shared.getToken(sender, function(header){
    return rp.get(`${awsUrl}/tasks?start_date=${start_date}&end_date=${end_date}`, header)
      .then(response => {
        const tasks = JSON.parse(response.body)
        return templates.taskListTemplate(tasks.data, date)
      })
      .catch(err => {
        return `Error fetch task list: ${JSON.stringify(err)}`
      })
  })
}

function singleTaskActions(sender, action, task_id){
  switch (action) {
    case 'view':
      return getSingleTask(sender, task_id, templates.singleTaskTemplate)
      break;
    case 'complete':
      return completeTask(sender, task_id)
      break;
    case 'checkin':
      return templates.locationTemplate()
      break;
    default:
      return `Task ${action}: ${task_id}`
  }
}

function getSingleTask(sender, task_id, cb){
  return shared.getToken(sender, function(header){
    return rp.get(`${awsUrl}/tasks/${task_id}`, header)
      .then(response => {
        const task = JSON.parse(response.body)
        return cb(task.data)
      })
      .catch(err => {
        console.log('error viewing task: ', err)
        return `Error viewing task: ${JSON.stringify(err)}`
      })
  })
}

function updateTaskDetails(task, fullName, user_id){
  const selectedTask = task
  var notifRecepient = task.utaskModel.filter(user => user.user_id !== user_id).map(item => `creator:${item.user_id}`)
  var formatted = utils.removeModel(selectedTask)
      formatted.status_id = 4
  const updateData = { value: formatted, notif_recepient: notifRecepient, actorName: fullName }

  return updateData
}

function completeTask(sender, task_id){
  return getSingleTask(sender, task_id, function(task){
    return shared.getToken(sender, function(header){
      const token = header.headers['x-auth-wf-token']
      const { user_id, user_firstname, user_lastname } = jwt(token)
      const fullName = user_firstname.concat(' ' + user_lastname)
      const params = updateTaskDetails(task, fullName, user_id)

      header.body = JSON.stringify(params)
      return rp.post(`${apiUrl}/api/complete_task`, header)
        .then(response => 'Task completed!')
        .catch(err => {
          console.log('error completing task: ', err)
          return `Error completing task: ${JSON.stringify(err)}`
        })
    })
  })
}

module.exports = {
  fetchTaskList: fetchTaskList,
  singleTaskActions: singleTaskActions
}
