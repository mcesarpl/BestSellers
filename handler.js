const AmazonScrapping = require('./src/amazonScrap/amazon.scraping');

const handler = new AmazonScrapping({
  section: 'book',
  size:'10'
});


module.exports = { scraping: handler.main.bind(handler)};
