const ApiBuilder = require('claudia-api-builder'),
    AWS = require('aws-sdk');
var api = new ApiBuilder(),
    dynamoDb = new AWS.DynamoDB.DocumentClient();

api.post('/claudia-bot', function (request) { 
  var params = {
    TableName: 'dynamo-test',
    Item: {
        userid: request.body.userid,
        token: request.body.token 
    }
  }
  return dynamoDb.put(params).promise(); 
}, { success: 201 }); 

api.get('/claudia-bot', function (request) { 
  return dynamoDb.scan({ TableName: 'dynamo-test' }).promise()
      .then(response => response.Items)
});

module.exports = api;
