const books = [];

module.exports = [
    {
        method: 'GET',
        path: '/books',
        handler: (request,h) => {
            return {
                status: 'success',
                data: { books }
            };
        }     
        
    },
    {
        method: ' POST',
        path: '/book',
        handler: (request, h) => {
            const payload = request.payload;
            return h.response({
                status: 'success',
                message: 'buku berhasil ditambah'
            }).code(201);
            }
        }

]