const dynamoController = require('../DBcontroller/dynamoController');

module.exports = {
  dynamoDb: new dynamoController(),
};
