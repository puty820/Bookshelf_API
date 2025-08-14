const { nanoid } = require('nanoid');
const { successResponse, errorResponse } = require('../utils/response');

let books = [];

const addBook = (req, res) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading
  } = req.body;

  if (readPage > pageCount) {
    return errorResponse(res, 400, 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount');
  }

  const id = nanoid();
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
  };

  books.push(newBook);

  return successResponse(res, 201, 'Buku berhasil ditambahkan', { bookId: id });
};
 const { nanoid } = require('nanoid');
 const books = require('../data/books');
 
 exports.addBook = (req, res) => {
   const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.body;
 
   if (!name) {
     return res.status(400).json({
       status: 'fail',
       message: 'Gagal menambahkan buku. Mohon isi nama buku'
     });
   }
 
   if (readPage > pageCount) {
     return res.status(400).json({
       status: 'fail',
       message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
     });
   }
 
   const id = nanoid(16);
   const insertedAt = new Date().toISOString();
   const updatedAt = insertedAt;
   const finished = pageCount === readPage;
 
   const newBook = { id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt };
   books.push(newBook);
 
   return res.status(201).json({
     status: 'success',
     message: 'Buku berhasil ditambahkan',
     data: { bookId: id }
   });
 };
 
 
 exports.getAllBooks = (req, res) => {
   const result = books.map(({ id, name, publisher }) => ({ id, name, publisher }));
   return res.status(200).json({
     status: 'success',
     data: { books: result }
   });
 };
 
 exports.getBookById = (req, res) => {
   const { id } = req.params;
   const book = books.find((b) => b.id === id);
 
   if (!book) {
     return res.status(404).json({
       status: 'fail',
       message: 'Buku tidak ditemukan'
     });
   }
 
   return res.status(200).json({
     status: 'success',
     data: { book }
   });
 };
 
 exports.updateBook = (req, res) => {
   const { id } = req.params;
   const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.body;
   const index = books.findIndex((b) => b.id === id);
 
   if (!name) {
     return res.status(400).json({
       status: 'fail',
       message: 'Gagal memperbarui buku. Mohon isi nama buku'
     });
   }
 
   if (readPage > pageCount) {
     return res.status(400).json({
       status: 'fail',
       message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
     });
   }
 
   if (index === -1) {
     return res.status(404).json({
       status: 'fail',
       message: 'Gagal memperbarui buku. Id tidak ditemukan'
     });
   }
 
   books[index] = {
     ...books[index],
     name,
     year,
     author,
     summary,
     publisher,
     pageCount,
     readPage,
     finished: pageCount === readPage,
     reading,
     updatedAt: new Date().toISOString()
   };
 
   return res.status(200).json({
     status: 'success',
     message: 'Buku berhasil diperbarui'
   });
 };
 
 exports.deleteBook = (req, res) => {
   const { id } = req.params;
   const index = books.findIndex((b) => b.id === id);
 
   if (index === -1) {
     return res.status(404).json({
       status: 'fail',
       message: 'Buku gagal dihapus. Id tidak ditemukan'
     });
   }
 
   books.splice(index, 1);
   return res.status(200).json({
     status: 'success',
     message: 'Buku berhasil dihapus'
   });
 };
 
 