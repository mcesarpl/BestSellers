const uuid = require('uuid');
const AWS = require('aws-sdk');
const settings = require('../../config/settings');
const dynamoDd = new AWS.DynamoDB.DocumentClient();

class DynamoController {
  async getAllItems() {
    const params = {
      TableName: settings.dbTableName,
    };
    const data = await dynamoDd.query(params).promise();

    return data;
  }

  async getTodayItems() {
    const params = {
      ExpressionAttributeNames: {
        '#title': 'title',
        '#writer': 'writer',
        '#rating': 'rating',
        '#price': 'price',
        '#ranking': 'ranking',
        '#createdAt': 'createdAt',
      },
      ExpressionAttributeValues: {
        ':createdAt': new Date().toDateString(),
      },
      FilterExpression: 'createdAt = :createdAt',
      ProjectionExpression:
        '#title, #writer, #rating, #price, #ranking, #createdAt',
      TableName: settings.dbTableName,
    };

    const { Items } = await dynamoDd.scan(params).promise();

    return Items;
  }

  async saveOneItem(item) {
    const params = {
      TableName: settings.dbTableName,
      Item: {
        ...item,
        id: uuid.v1(),
        createdAt: new Date().toDateString(),
      },
    };
    await dynamoDd.put(params).promise();
    return;
  }

  async saveManyItems(items) {
    const itemsArray = items.map((item) => {
      return {
        PutRequest: {
          Item: {
            ...item,
            id: uuid.v1(),
            createdAt: new Date().toDateString(),
          },
        },
      };
    });
    const params = {
      RequestItems: {
        [settings.dbTableName]: itemsArray,
      },
    };

    await dynamoDd.batchWrite(params).promise();
    return;
  }
}

module.exports = DynamoController;
