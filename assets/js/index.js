const puppeteer =  require('puppeteer');
const cheerio = require('cheerio');
const rapplerBaseUrl = 'https://www.rappler.com/?s';
const abscbn = 'https://news.abs-cbn.com/special-pages/search#gsc.tab=0';

async function __init__() {
	return await puppeteer.launch();
}

async function __exit__(browser) {
	await browser.close();
}

async function searchOperations(item) {
	const browser = await __init__();
	const rapplerArticles = await rapplerSearchScrape(browser, item);
	__exit__(browser);

	return { rapplerArticles };
} 

async function rapplerSearchScrape(browser, item) {
	try {
		const page = await browser.newPage();
		await page.goto(rapplerBaseUrl, {
			waitUntil: 'networkidle2'
		});

		await page.focus('input[type="search"]');
		await page.keyboard.type(item);
		await Promise.all([page.waitForNavigation(), page.click('form > button')]);

		const items = await page.$$eval('main > #primary > article', (articles) => {
			return articles.map( article => article.innerHTML);
   		});
    	
    	const articles = [];
    	for(let _item of items) {
    		let article = {};
    		const $ = cheerio.load(_item);
    		const title = $('div > h2 > a').text().trim();
    		const url = $('div > h2 > a').attr('href');
    		const datetime = $('div > time').attr('datetime');
    		const cover = $('figure > a > img').attr('src'); 
    		$.html();

    		article.title = title;
    		article.url = url;
    		article.datetime = datetime;
    		article.cover = cover;
    		articles.push(article);
		}

		return articles;
    	
	} catch(err) {
		console.log(err)
	}
}


module.exports = {
	searchOperations
}