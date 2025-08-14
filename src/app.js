const express = require('express');
const app = express();
app.use(express.json());

const booksRouter = require('../routers/books');
app.use('/books', booksRouter);

module.exports = app;