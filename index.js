require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser  = require('cookie-parser');

const indexRouter = require('./route/route');
const app = express();


app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'assets')));

app.use('/', indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`server is running on PORT: ${PORT}`);
});