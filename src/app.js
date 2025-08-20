const hapi = require('@hapi/hapi');
const booksRoutes = ('./routers/books');

const init= async () => {
    const server = hapi.server ( {
        port: 9000,
        host: 'localhost',
        routes: {
            cors: { origin: ['*']}
        }
    });
server.route(boooksRoutes);

await server.start();
console.log('server berjalan di ${server.info.uri}');
};
