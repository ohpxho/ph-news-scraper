const express = require('express');
const router = express.Router();
const scraper = require('../assets/js/index');

router.get('/', (req, res) => {
	res.render('index');
});

router.post('/scrape', async (req, res) => {
	const articles = await scraper.searchOperations(req.body.item);
	res.render('index', { articles: articles });
});

module.exports = router;