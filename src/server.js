const express = require('express');
const { nanoid } = require('nanoid');

const app = express();
const PORT = 9000;

app.use(express.json());

let books = [];

function validateBookPayload(payload) {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = payload;

  if (typeof name !== 'string' || name.trim() === '') {
    return 'Mohon isi nama buku dengan string yang valid';
  }
  if (typeof year !== 'number') {
    return 'Tahun harus berupa number';
  }
  if (typeof author !== 'string') {
    return 'Author harus berupa string';
  }
  if (typeof summary !== 'string') {
    return 'Summary harus berupa string';
  }
  if (typeof publisher !== 'string') {
    return 'Publisher harus berupa string';
  }
  if (typeof pageCount !== 'number' || pageCount < 0) {
    return 'pageCount harus berupa number dan >= 0';
  }
  if (typeof readPage !== 'number' || readPage < 0) {
    return 'readPage harus berupa number dan >= 0';
  }
  if (readPage > pageCount) {
    return 'readPage tidak boleh lebih besar dari pageCount';
  }
  if (typeof reading !== 'boolean') {
    return 'reading harus berupa boolean';
  }

  return null;
}

app.post('/books', (req, res) => {
  const validationError = validateBookPayload(req.body);
  if (validationError) {
    return res.status(400).json({
      status: 'fail',
      message: `Gagal menambahkan buku. ${validationError}`,
    });
  }

  const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.body;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    id, name, year, author, summary, publisher,
    pageCount, readPage, finished, reading,
    insertedAt, updatedAt,
  };

  books.push(newBook);

  return res.status(201).json({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: { bookId: id },
  });
});

app.put('/books/:id', (req, res) => {
  const validationError = validateBookPayload(req.body);
  if (validationError) {
    return res.status(400).json({
      status: 'fail',
      message: `Gagal memperbarui buku. ${validationError}`,
    });
  }

  const { id } = req.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.body;

  const index = books.findIndex(b => b.id === id);

  if (index === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
  }

  books[index] = {
    ...books[index],
    name, year, author, summary, publisher,
    pageCount, readPage,
    finished: pageCount === readPage,
    reading,
    updatedAt: new Date().toISOString(),
  };

  return res.status(200).json({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
});


app.get('/books', (req, res) => {
  const result = books.map(({ id, name, publisher }) => ({ id, name, publisher }));
  return res.status(200).json({
    status: 'success',
    data: { books: result },
  });
});

app.get('/books/:id', (req, res) => {
  const { id } = req.params;
  const book = books.find(b => b.id === id);

  if (!book) {
    return res.status(404).json({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
  }

  return res.status(200).json({
    status: 'success',
    data: { book },
  });
});

app.delete('/books/:id', (req, res) => {
  const { id } = req.params;
  const index = books.findIndex(b => b.id === id);

  if (index === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
  }

  books.splice(index, 1);

  return res.status(200).json({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});