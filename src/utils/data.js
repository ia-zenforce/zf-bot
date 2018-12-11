const list = [
  {task_id: 1, task_title: 'Maintenance', task_target_start: '2018-03-26 08:00:00', task_target_end: '2018-03-26 17:00:00', status: 'On Going'},
  {task_id: 2, task_title: 'Meeting', task_target_start: '2018-03-26 08:00:00', task_target_end: '2018-03-26 17:00:00', status: 'On Going'},
  {task_id: 3, task_title: 'Collation of FSS Report', task_target_start: '2018-03-26 08:00:00', task_target_end: '2018-03-26 17:00:00', status: 'On Going'},
  {task_id: 4, task_title: 'Saturation', task_target_start: '2018-03-26 08:00:00', task_target_end: '2018-03-26 17:00:00', status: 'On Going'},
  {task_id: 5, task_title: 'Application for Loan', task_target_start: '2018-03-26 08:00:00', task_target_end: '2018-03-26 17:00:00', status: 'On Going'},
  {task_id: 6, task_title: 'Business Orientation Program', task_target_start: '2018-03-26 08:00:00', task_target_end: '2018-03-26 17:00:00', status: 'On Going'},
  {task_id: 1, task_title: 'Maintenance', task_target_start: '2018-03-26 08:00:00', task_target_end: '2018-03-26 17:00:00', status: 'On Going'},
  {task_id: 2, task_title: 'Meeting', task_target_start: '2018-03-26 08:00:00', task_target_end: '2018-03-26 17:00:00', status: 'On Going'},
  {task_id: 3, task_title: 'Collation of FSS Report', task_target_start: '2018-03-26 08:00:00', task_target_end: '2018-03-26 17:00:00', status: 'On Going'},
  {task_id: 4, task_title: 'Saturation', task_target_start: '2018-03-26 08:00:00', task_target_end: '2018-03-26 17:00:00', status: 'On Going'},
]

function taskActions(text){
  const type = text.split('-')[0]
  const actions = {
    complete: 'Task Completed: ',
    checkin: 'Task Check-in: ',
    view: 'Task View: '
  }

  return actions[type]
}

module.exports = {
  list: list,
  taskActions: taskActions
}
