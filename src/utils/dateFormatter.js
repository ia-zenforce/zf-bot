var moment = require('moment')

function fullDate(date){
  return moment(date).format('MM/DD/YY hh:mmA')
}


module.exports = {
  fullDate: fullDate
}
