const express = require('express');
const {
    addBook,
    getBookById,
    updateBook,
    deleteBook,
} = require('../controllers/books');

const router = express.Router();

router.post('/', addBook);
router.get('/:bookId', getBookById);
router.put('/:bookId', updateBook);
router.delete('/:bookId',deleteBook);

module.exports = router;