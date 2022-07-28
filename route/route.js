const express = require('express');
const router = express.Router();
const scraper = require('../assets/js/index');

router.get('/', (req, res) => {
	res.render('index');
});

router.post('/scrape', (req, res) => {
	const articles = scraper.searchOperations(req.body.item);
	res.redirect('/');
});

module.exports = router;