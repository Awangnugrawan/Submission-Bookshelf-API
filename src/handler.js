const {nanoid} = require('nanoid');
const BookshelfAPI = require('./books');

// API dapat menyimpan buku
const addBooksHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload;

    //  mengecek apakah parameter 'nama' bernilai null atau kosong
    if (!name || name === '') {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        })
        response.code(400);
        return response;
    }

    const id = nanoid(16);

    // pengecekan kondisi jika 'readPage' lebih besar dari 'pageCount' maka statusnya akan gagal
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const isFinished = (pageCount, readPage) => {
        if (pageCount === readPage) {
            return true;
        }else{
            return false;
        }
    }
    const finished = isFinished(readPage, pageCount);

    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        insertedAt,
        updatedAt,
        reading
    };

    BookshelfAPI.push(newBook);

    const isSuccess = BookshelfAPI.filter(book => book.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            }
        })
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    })
    response.code(500);
    return response;
};




// API dapat menampilkan seluruh buku
const getAllBooksHandler = (request, h) => {
    const {
        name,
        reading,
        finished
    } = request.query;

    //  fitur query parameters query parameters = ?name
    if (name) {
        // variabel untuk name non-case sensitive  (tidak peduli besar dan kecil huruf).
        const UpperName = name.toUpperCase()

        const response = h.response({
            status: 'success',
            data: {
                books: BookshelfAPI
                    .filter((n) => n.name === UpperName)
                    .map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher
                    }))
            }
        })
        response.code(200)
        return response
    }

    // fitur query parameters query parameters = ?reading
    // 0 = menampilkan buku yang sedang tidak dibaca
    if (reading === '0') {
        const response = h.response({
            status: 'success',
            message: 'list BookshelfAPI that are not being read',
            data: {
                books: BookshelfAPI
                    .filter((r) => r.reading === false)
                    .map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher
                    }))
            }
        })
        response.code(200)
        return response
    }

    // 1 = menampilkan buku yang sedang dibaca
    if (reading === '1') {
        const response = h.response({
            status: 'success',
            data: {
                books: BookshelfAPI
                    .filter((r) => r.reading === true)
                    .map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher
                    }))
            }
        })
        response.code(200)
        return response
    }

     // fitur query parameters query parameters = ?finished
    // 0 = menampilkan buku yang belum dibaca
    if (finished === '0') {
        const response = h.response({
            status: 'success',
            data: {
                books: BookshelfAPI
                    .filter((f) => f.finished === false)
                    .map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher
                    }))
            }
        })
        response.code(200)
        return response
    }

    // 1 = menampilkan buku yang sudah dibaca
    if (finished === '1') {
        const response = h.response({
            status: 'success',
            data: {
                books: BookshelfAPI
                    .filter((f) => f.finished === true)
                    .map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher
                    }))
            }
        })
        response.code(200)
        return response
    }

    // hanya menampilkan 3 atribut: ID, name, publisher
    const response = h.response({
        status: 'success',
        data: {
            books: BookshelfAPI.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher
            }))
        }
    });
    response.code(200)
    return response
};

// API dapat menampilkan detail buku
const getByIdBooksHandler = (request, h) => {
    const {
        bookId
    } = request.params

    const book = BookshelfAPI.filter((book) => book.id === bookId)[0]
    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            }
        };
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
    })
    response.code(404)
    return response
};

// API dapat mengubah data buku
const editBooksHandler = (request, h) => {
    const {
        bookId
    } = request.params

    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        })
        response.code(400)
        return response
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        })
        response.code(400)
        return response
    }

    const updatedAt = new Date().toISOString()

    const index = BookshelfAPI.findIndex((book) => book.id === bookId)

    if (index !== -1) {
        BookshelfAPI[index] = {
            ...BookshelfAPI[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt
        }
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        })
        response.code(200)
        return response
    }
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
    })
    response.code(404)
    return response
};

//  API dapat menghapus buku
const deleteBooksHandler = (request, h) => {
    const {
        bookId
    } = request.params

    const index = BookshelfAPI.findIndex((book) => book.id === bookId)

    if (index !== -1) {
        BookshelfAPI.splice(index, 1)

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        })
        response.code(200)
        return response
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    })
    response.code(404)
    return response
};


module.exports = {
    addBooksHandler,
    getAllBooksHandler,
    getByIdBooksHandler,
    editBooksHandler,
    deleteBooksHandler,
};