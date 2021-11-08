const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');
const globalParams = require('../util/globalparams');

class PuppeteerController {
  async init() {
    const userAgent = globalParams.USERAGENT;

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    await page.setUserAgent(userAgent);

    return {
      page,
      browser,
    };
  }

  async goto({ page, link, awaitSelector }) {
    await page.goto(link);

    await page.waitForSelector(awaitSelector || '');
    return;
  }

  async scrapInfoAmazon({
    page,
    itemClass,
    titleClass,
    writerClass,
    ratingClass,
    priceClass,
    rankingClass,
  }) {
    const items = await page.evaluate(
      ({
        itemClass,
        titleClass,
        writerClass,
        ratingClass,
        priceClass,
        rankingClass,
      }) => {
        const items = Array.from(document.querySelectorAll(itemClass));
        const formatedArray = items.map((item) => {
          const title = item
            .getElementsByClassName(titleClass)[0]
            .getElementsByTagName('img')[0].alt;
          const writer = item.getElementsByClassName(writerClass)[0]?.innerHTML;
          const rating = item.getElementsByClassName(ratingClass)[0]?.innerHTML;
          const price = item.getElementsByClassName(priceClass)[0]?.innerHTML;
          const ranking =
            item.getElementsByClassName(rankingClass)[0]?.innerHTML;
          return { title, writer, rating, price, ranking };
        });

        return formatedArray;
      },
      {
        itemClass,
        titleClass,
        writerClass,
        ratingClass,
        priceClass,
        rankingClass,
      }
    );

    return items;
  }

  async closePage(browser) {
    await browser.close();
    return;
  }
}

module.exports = PuppeteerController;
