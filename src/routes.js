const {
    addBooksHandler,
    getAllBooksHandler,
    getByIdBooksHandler,
    editBooksHandler,
    deleteBooksHandler
} = require('./handler')

const routes = [{
        method: 'POST',
        path: '/books',
        handler: addBooksHandler, // API dapat menyimpan buku
    }, {
        method: 'GET',
        path: '/books',
        handler: getAllBooksHandler, // API dapat menampilkan seluruh buku
    }, {
        method: 'GET',
        path: '/books/{bookId}',
        handler: getByIdBooksHandler, // API dapat menampilkan detail buku
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: editBooksHandler, // API dapat mengubah data buku
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBooksHandler, //  API dapat menghapus buku
    }
];

module.exports = routes;