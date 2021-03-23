const mongoose = require('mongoose');

const LoginSchema = mongoose.Schema({
    USER_ID:String,
    FIRST_NAME:String,
    LAST_NAME:String,
    EMAIL:String,
    PASSWORD:String,
    NAME:String,
    MOBILE:Number,
    OTP:Number,
    CHECKSUM: Number
});

const RegisterSchema = mongoose.Schema({
    userID: Number,
    username: String,
    name: String,
    password: String,
    email: String,
    mobile: Number,
    isAdmin: Boolean,
    role: Number
})

const BookSchema = mongoose.Schema({
    Book_ID: Number,
    Book_Name: String,
    Author_Name: String,
    Publication:String,
    Price: Number,
    Count: Number
})

const uniqueNum = mongoose.Schema({
    bookID: Number,
    userID: Number
})

const borrowedBooksSchema = mongoose.Schema({
    Book_ID: Array,
    userID: Number,
    username: String,
    name: String,
    books: Array,
    assignedBy: String,
    assignDate: Date,
    returnDate: Date
})

const userLog = mongoose.Schema({
    bookID: Array,
    userID: Number,
    username: String,
    name: String,
    books: Array,
    assignedBy: Array,
    assignDate: Array,
    returnDate: Array
})

const reqBook = mongoose.Schema({
    username: String,
    name: String, 
    Book_ID: Number,
    Book_Name: String
})

exports.User = mongoose.model('User', LoginSchema);
exports.Register = mongoose.model('Register', RegisterSchema);
exports.Book = mongoose.model('Book', BookSchema);
exports.uniqID = mongoose.model('uniqID', uniqueNum);
exports.booksBorrowed = mongoose.model('booksBorrowed', borrowedBooksSchema);
exports.userLog = mongoose.model('userLog', userLog);
exports.RequestBook = mongoose.model('reqBook', reqBook);