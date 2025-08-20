'use strict';

const Hapi = require('@hapi/hapi');
const { nanoid } = require('nanoid');

const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: 'localhost'
  });

  let books = [
    {
      id: "1a2b3c",
      name: "Laskar Pelangi",
      year: 2005,
      author: "Andrea Hirata",
      summary: "Kisah anak-anak Belitong yang penuh semangat belajar.",
      publisher: "Bentang Pustaka",
      pageCount: 529,
      readPage: 100,
      finished: false,
      reading: true,
      insertedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "4d5e6f",
      name: "Bumi Manusia",
      year: 1980,
      author: "Pramoedya Ananta Toer",
      summary: "Perjalanan Minke melawan kolonialisme.",
      publisher: "Hasta Mitra",
      pageCount: 535,
      readPage: 535,
      finished: true,
      reading: false,
      insertedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  function validateBookPayload(payload) {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = payload;
    
    if (typeof name !== 'string' || name.trim() === '') {
      return 'Mohon isi nama buku dengan string yang valid';
    }
    if (year && typeof year !== 'number') {
      return 'Tahun harus berupa number';
    }
    if (author && typeof author !== 'string') {
      return 'Author harus berupa string';
    }
    if (summary && typeof summary !== 'string') {
      return 'Summary harus berupa string';
    }
    if (publisher && typeof publisher !== 'string') {
      return 'Publisher harus berupa string';
    }
    if (typeof pageCount !== 'number' || pageCount < 0) {
      return 'pageCount harus berupa number dan >= 0';
    }
    if (typeof readPage !== 'number' || readPage < 0) {
      return 'readPage harus berupa number dan >= 0';
    }
    if (!name) {
      return 'Mohon isi nama buku';
    }
    if (readPage > pageCount) {
      return 'readPage tidak boleh lebih besar dari pageCount';
    }
    if (typeof reading !== 'boolean') {
      return 'reading harus berupa boolean';
    }

    return null;
  }

  server.route({
    method: 'POST',
    path: '/books',
    handler: (request, h) => {
      const validationError = validateBookPayload(request.payload);
      
      if (validationError) {
        return h.response({
          status: 'fail',
          message: `Gagal menambahkan buku. ${validationError}`
        }).code(400);
      }

      const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
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

      return h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: { bookId: id }
      }).code(201);
    }
  });

  server.route({
    method: 'GET',
    path: '/books',
    handler: () => {
      const result = books.map(({ id, name, publisher }) => ({ id, name, publisher }));
      return {
        status: 'success',
        data: { books: result }
      };
    }
  });

  server.route({
    method: 'GET',
    path: '/books/{id}',
    handler: (request, h) => {
      const { id } = request.params;
      const book = books.find(b => b.id === id);

      if (!book) {
        return h.response({
          status: 'fail',
          message: 'Buku tidak ditemukan'
        }).code(404);
      }

      return {
        status: 'success',
        data: { book }
      };
    }
  });

  server.route({
    method: 'PUT',
    path: '/books/{id}',
    handler: (request, h) => {
      const validationError = validateBookPayload(request.payload);
      if (validationError) {
        return h.response({
          status: 'fail',
          message: `Gagal memperbarui buku. ${validationError}`
        }).code(400);
      }

      const { id } = request.params;
      const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

      const index = books.findIndex(b => b.id === id);

      if (index === -1) {
        return h.response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Id tidak ditemukan'
        }).code(404);
      }

      books[index] = {
        ...books[index],
        name, year, author, summary, publisher,
        pageCount, readPage,
        finished: pageCount === readPage,
        reading,
        updatedAt: new Date().toISOString()
      };

      return {
        status: 'success',
        message: 'Buku berhasil diperbarui'
      };
    }
  });

  server.route({
    method: 'DELETE',
    path: '/books/{id}',
    handler: (request, h) => {
      const { id } = request.params;
      const index = books.findIndex(b => b.id === id);

      if (index === -1) {
        return h.response({
          status: 'fail',
          message: 'Buku gagal dihapus. Id tidak ditemukan'
        }).code(404);
      }

      books.splice(index, 1);

      return {
        status: 'success',
        message: 'Buku berhasil dihapus'
      };
    }
  });

  await server.start();
  console.log(`✅ Server berjalan pada ${server.info.uri}`);
};

init().catch((error) => {
  console.error(error);
  process.exit(1);
});