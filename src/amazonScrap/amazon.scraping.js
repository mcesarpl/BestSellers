
const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

class AmazonScrapping {
    constructor({ section, size }) {
        this.section = section;
        this.size = size;
    }

    async scrapInfo() {

        const itemClass = '.zg-item-immersion';
        const titleClass = 'a-section a-spacing-small';
        const writerClass = 'a-size-small a-link-child';
        const ratingClass = 'a-icon-alt';
        const priceClass = 'p13n-sc-price';
        const linkAmazonBestSellersBooks = 'https://www.amazon.com/Best-Sellers-Books/zgbs/books/ref=zg_bs_nav_0';

        const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';

        const browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
          });

        const page = await browser.newPage();

        await page.setUserAgent(userAgent);

        await page.goto(linkAmazonBestSellersBooks);

        await page.waitForSelector(itemClass);

        const items = await page.evaluate(({itemClass, titleClass, writerClass, ratingClass, priceClass}) => {
            const items = Array.from(document.querySelectorAll(itemClass));
            const formatedArray = items.map(item => {
                const title = item.getElementsByClassName(titleClass)[0].getElementsByTagName('img')[0].alt; 
                const writer = item.getElementsByClassName(writerClass)[0]?.innerHTML;
                const rating = item.getElementsByClassName(ratingClass)[0]?.innerHTML;
                const price = item.getElementsByClassName(priceClass)[0]?.innerHTML;
                return({title, writer, rating, price});
            });
    
            return formatedArray;
          }, {itemClass, titleClass, writerClass, ratingClass, priceClass});

        await browser.close();

        return items;
    }

    formatItems(items) {

        const formatedArray = items.map(item => {
            let { title, writer, rating, price } = item;

            title = title?.trim();
            writer = writer?.trim();
            rating = rating?.trim();
            price = price?.trim();

            return({title, writer, rating, price});
        });

        return formatedArray;
    }

    handlerSuccess(data) {
        const response = {
            statusCode: 200,
            body: JSON.stringify(data)
        };

        return response;
    }

    handlerError(data) {
        const error = {
            statusCode: data.statusCode || 501,
            headers: {'Content-Type': 'text/plain'},
            body: 'Couldn\'t create item!!'
        };

        return error;
    }

    async main(event) {
        try {

            const items = await this.scrapInfo();
            const formated = this.formatItems(items);

            return this.handlerSuccess(formated);

        } catch (error) {
            console.log('Error: ', error.stack);
            return this.handlerError({ statusCode: 500});
        }
    }

}

module.exports = AmazonScrapping;