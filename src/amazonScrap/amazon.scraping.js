const { puppeteer } = require('../factories/puppeteerFactory');
const globalParams = require('../util/globalparams');

class AmazonScrapping {
  async scrapInfo(params) {
    const { itemClass } = params;

    const { page, browser } = await puppeteer.init();

    await puppeteer.goto({
      page,
      link: globalParams.LINKAMAZONBESTSELLERS,
      awaitSelector: itemClass,
    });

    const items = await puppeteer.scrapInfoAmazon({ page, ...params });

    await puppeteer.closePage(browser);

    return items;
  }

  formatItems(items) {
    const formatedArray = items.map((item) => {
      let { title, writer, rating, price, ranking } = item;

      title = title?.trim();
      writer = writer?.trim();
      rating = rating?.trim();
      price = price?.trim();
      ranking = ranking?.trim();

      return { title, writer, rating, price, ranking };
    });

    return formatedArray;
  }
}

module.exports = AmazonScrapping;
