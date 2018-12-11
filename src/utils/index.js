var isEmpty = require('lodash.isempty')

function getParamsValue(params){
  return params.split('-')[1]
}

function _isBlank(text){
  return text.trim() === ''
}

function _isEmpty(collection){
  return isEmpty(collection)
}

function setHeader(token){
  const options = {
    headers: {
      'Content-Type': 'application/json',
      'x-auth-wf-token': token,
      'x-auth-refresh-wf-token': token
    }
  }

  return options
}

function removeModel(data){
  delete data.attachmentModel
  delete data.commentModel
  delete data.delModel
  delete data.deviceModel
  delete data.projTaskModel
  delete data.statusModel
  delete data.tagModel
  delete data.taskClientModel
  delete data.taskExtra
  delete data.taskLabelModel
  delete data.utaskModel
  return data
}

module.exports = {
  _isEmpty: _isEmpty,
  _isBlank: _isBlank,
  setHeader: setHeader,
  getParamsValue: getParamsValue,
  removeModel: removeModel
}
