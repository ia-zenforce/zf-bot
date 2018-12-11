const rp = require('minimal-request-promise')
      utils = require('../utils'),
      config = require('../../config')

const { facebookAccessToken, apiGetway } = config

function getToken(sender, cb){
  return rp.get(`${apiGetway}/user/${sender}`)
    .then(response => {
      const res = JSON.parse(response.body)
      if(utils._isEmpty(res)){
        return `Error retrieving token.`
      }
      const header = utils.setHeader(res.token)
      return cb(header)
    })
    .catch(err => `Get Token error! ${err}`)
}

function getName(sender) {
  return rp.get(`https://graph.facebook.com/v2.6/${sender}?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=${facebookAccessToken}`)
    .then(response => {
      const user = JSON.parse(response.body)
      return user.first_name
    })
}

function nameWrapper(sender, cb){
  return getName(sender).then(name => cb(name))
}
module.exports = {
  getName: getName,
  getToken: getToken,
  nameWrapper: nameWrapper
}
