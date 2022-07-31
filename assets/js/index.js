const puppeteer =  require('puppeteer');
const cheerio = require('cheerio');

const rapplerBaseUrl = 'https://www.rappler.com/?s';
const abscbnBaseUrl = 'https://news.abs-cbn.com/special-pages/search#gsc.tab=0';

async function __init__() {
	return await puppeteer.launch();
}

async function __exit__(browser) {
	await browser.close();
}

async function searchOperations(item) {
	const browser = await __init__();
	const articles = [];
	const rapplerArticles = await rapplerSearchScrape(browser, item);
	const abscbnArticles = await abscbnSearchScrape(browser, item);
	__exit__(browser);

	const _articles = articles.concat(rapplerArticles, abscbnArticles);
	return _articles;
} 

async function rapplerSearchScrape(browser, item) {
	try {
		const page = await browser.newPage();
		const url = `${rapplerBaseUrl}=${item}`;
		await page.goto(url, {
			waitUntil: 'networkidle2'
		});

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

async function abscbnSearchScrape(browser, item) {
	try {
		const page = await browser.newPage();
		item = item.replaceAll(' ', '%20');
		const url = `${abscbnBaseUrl}&gsc.q=${item}&gsc.sort=date`;
		console.log(url);
		await page.goto(url, {
			waitUntil: 'networkidle2',
			timeout: 0
		});
	
		const items = await page.$$eval('.gsc-expansionArea > .gsc-result', (articles) => {
			return articles.map( article => article.innerHTML);
   		});

		const articles = [];
    	for(let _item of items) {
    		let article = {};
    		const $ = cheerio.load(_item);
    		const title = $('div > div > div > a').text().trim();
    		const url = $('div > div > div > a').attr('href');
    		const datetime = $('div > div:nth-child(3) > div:nth-child(2) > div:nth-child(3)').text();
    		const cover = $('div > div:nth-child(3) > div > div > a > img').attr('src'); 
    		$.html();

    		article.title = title;
    		article.url = url;
    		article.datetime = datetime;
    		article.cover = cover;
    		articles.push(article);
		}

		console.log(articles);
		return articles;

	} catch(err) {
		console.log(err);
	}
}

module.exports = {
	searchOperations
}