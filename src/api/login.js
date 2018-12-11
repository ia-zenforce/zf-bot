const rp = require('minimal-request-promise')
      moment = require('moment')
      utils = require('../utils')
      jwt = require('jwt-decode')
      shared = require('./shared')
      config = require('../../config')
      defaultTemplates = require('../templates')
      loginTemplates = require('../templates/login')

const { facebookAccessToken, apiGetway, awsUrl } = config

function logOut(sender){
  const dbOptions = {
    headers: { 'Content-Type': 'application/json' }
  }

  return rp.delete(`${apiGetway}/user/${sender}`, dbOptions)
    .then(res => unlinkAccount(sender))
    .catch(err => `Error deleting token: ${JSON.stringify(err)}`)
}

function unlinkAccount(sender){
  const options = {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({psid: sender})
  }

  return rp.post(`https://graph.facebook.com/v2.6/me/unlink_accounts?access_token=${facebookAccessToken}`, options)
    .then(res => `Logged out.`)
    .catch(err => `Error unlinking account: ${JSON.stringify(err)}`)
}

function saveToken(response, sender){
  const res = JSON.parse(response.body)
  const dbOptions = {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({userid: sender, token: res.access_token})
  }

  return rp.post(`${apiGetway}/user`, dbOptions)
    .then(dbres => shared.nameWrapper(sender, defaultTemplates.signedInTemplate))
    .catch(err => `Login error! ${err}`)
}

function saveUserToken(token, sender){
  const dbOptions = {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({userid: sender, token: token})
  }

  return rp.post(`${apiGetway}/user`, dbOptions)
    .then(dbres => shared.nameWrapper(sender, defaultTemplates.signedInTemplate))
    .catch(err => `Login error! ${err}`)
}

function checkToken(sender){
  const dbOptions = {
    headers: { 'Content-Type': 'application/json' }
  }

  return rp.get(`${apiGetway}/user/${sender}`, dbOptions)
    .then(response => {
      const res = JSON.parse(response.body)
      if(utils._isEmpty(res)){
        return shared.nameWrapper(sender, loginTemplates.loginTemplate)
      }else{
        return shared.getName(sender).then(name => verifyIfValidToken(name, res))
      }
    })
    .catch(err => {
      console.log('check token error: ', err)
      return `Check Token error! ${JSON.stringify(err)}`
    })
}

function verifyIfValidToken(name, res){
  const { token } = res
  const expiration = jwt(token).exp
  const today = new Date()
  const tokenExpiration = new Date(expiration*1000)
  const isValidToken = moment(today).isSameOrBefore(moment(tokenExpiration))
  return isValidToken ? defaultTemplates.signedInTemplate(name) : loginTemplates.loginTemplate(name)
}

module.exports = {
  logOut: logOut,
  checkToken: checkToken,
  saveUserToken: saveUserToken
}
