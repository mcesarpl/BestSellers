const amazonScraper = require('./src/amazonScrap/amazon.scraping');
const { dynamoDb } = require('./src/factories/dynamoFactory');

class Handler {
  static handlerSuccess({ message }) {
    const response = {
      statusCode: 200,
      body: message,
    };

    return response;
  }

  static handlerError({ statusCode, errorStack }) {
    const response = {
      statusCode: statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: errorStack,
    };

    return response;
  }

  static async handleScrap() {
    try {
      const amazon = new amazonScraper();

      const itemClass = '.zg-item-immersion';
      const titleClass = 'a-section a-spacing-small';
      const writerClass = 'a-size-small a-link-child';
      const ratingClass = 'a-icon-alt';
      const priceClass = 'p13n-sc-price';
      const rankingClass = 'zg-badge-text';
      const numberOfItens = 10;

      const items = await amazon.scrapInfo({
        itemClass,
        titleClass,
        writerClass,
        ratingClass,
        priceClass,
        rankingClass,
      });

      const reducedVector = items.slice(0, numberOfItens);

      const formated = amazon.formatItems(reducedVector);

      await dynamoDb.saveManyItems(formated);

      return Handler.handlerSuccess({ message: 'Itens created with success!' });
    } catch (error) {
      return Handler.handlerError({
        statusCode: 500,
        errorStack: JSON.stringify(error.stack),
      });
    }
  }

  static async handleListToday() {
    try {
      const items = await dynamoDb.getTodayItems();

      return Handler.handlerSuccess({ message: JSON.stringify(items) });
    } catch (error) {
      return Handler.handlerError({
        statusCode: 500,
        errorStack: JSON.stringify(error.stack),
      });
    }
  }
}

module.exports = {
  scraping: Handler.handleScrap,
  listToday: Handler.handleListToday,
};
