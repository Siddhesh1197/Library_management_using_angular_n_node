module.exports = (app) => {
    const controller = require('../controller/controller.js');

    app.post('/login', controller.login);
    app.post('/register', controller.register);
    app.get('/getAllUsers', controller.getAllUsers);
    app.get('/getAllBooks', controller.getAllBooks);
    app.post('/addBook', controller.addBook);
    app.post('/getBooksByUser', controller.getBooksByUser);
    app.post('/updateUsersBooks', controller.updateUsersBooks);
    app.get('/getAllNonAdminUsers', controller.getAllNonAdminUsers);
    app.post('/searchByBookName', controller.searchBookByName);
    app.post('/searchByAuthorName', controller.searchBookByAuthorName);
    app.post('/getUserBooksByID', controller.getUserBooksByID);
    app.post('/addBooksInRequestQueue', controller.addBookInRequestQueue);
    app.post('/getBooksInRequestQueue', controller.getBookInRequestQueue);
    app.get('/getAllBooksInRequest', controller.getAllBooksInRequest);
    app.post('/approveRejectBook', controller.approveRejectBook);
    app.post('/returnBook', controller.returnBook);
    app.get('/getAllBooks', controller.getAllBooks);
}