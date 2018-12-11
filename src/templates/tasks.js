var botBuilder = require('claudia-bot-builder'),
    fbTemplate = botBuilder.fbTemplate
    utils = require('../utils')
    dateFormatter = require('../utils/dateFormatter')

function taskListTemplate(tasks, date){
  const generic = new fbTemplate.Generic();
  if(utils._isEmpty(tasks) || !tasks){
    generic.addBubble(`You have no available tasks for ${date}.`, 'No tasks.')
  }else{
    tasks.map(item => {
      const { task_id, task_title, task_target_start, task_target_end, statusModel: { status_name } } = item
      generic.addBubble(task_title, `Status: ${status_name}`)
      if(status_name !== 'Completed'){
        generic.addButton('Complete', `complete-${task_id}`)
      }

      generic.addButton('View task', `view-${task_id}`)
      // .addButton('Check-in', `checkin-${task_id}`)
    })
  }

  return generic.get()
}

function singleTaskTemplate(task){
  const { task_id, task_title, task_description, statusModel: { status_name }, task_target_start, task_target_end } = task
  const list = new fbTemplate.List('compact');
  const description = utils._isBlank(task_description) ? 'None.' : `${task_description.substr(0, 77)}...`
  list.addBubble(task_title, description)
    .addBubble(`Start Date: ${dateFormatter.fullDate(task_target_start)}`,
      `End Date: ${dateFormatter.fullDate(task_target_end)}`)
    .addBubble('Status', status_name)
  if(status_name !== 'Completed'){
    list.addListButton('COMPLETE TASK', `complete-${task_id}`)
  }

  return list.get();
}

function locationTemplate(){
  const generic = new fbTemplate.Generic()
  generic.addBubble('Current Location', 'Please provide your location.')
    .addQuickReplyLocation()

  return generic.get()
}

module.exports = {
  taskListTemplate: taskListTemplate,
  locationTemplate: locationTemplate,
  singleTaskTemplate: singleTaskTemplate
}
