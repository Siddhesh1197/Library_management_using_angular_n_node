import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private http:HttpClient) { }

  addBook(payload){
    console.log("Inside Shared Service: ", payload)
    return this.http.post('/addBook', payload);
  }

  checkUserExist(payload){
    console.log("Inside checkUserExist -> shared Service: ", payload)
    return this.http.post('/checkUserExist', payload);
  }

  getUserBook(payload){
    console.log("Inside getUserBook -> shared Service: ", payload)
    return this.http.post('/getBooksByUser', payload);
  }

  updateUserBooks(payload){
    console.log("Inside updateUserBooks -> shared Service: ", payload)
    return this.http.post('/updateUsersBooks', payload);
  }

  getNonAdminUsers(){
    console.log("Inside getNonAdminUsers -> shared Service: ")
    return this.http.get('/getAllNonAdminUsers');
  }

  searchBookByName(payload){
    console.log("Inside searchBookByName -> shared Service: ", payload)
    return this.http.post('/searchByBookName', payload);
  }

  searchBookByAuthorName(payload){
    console.log("Inside searchBookByAuthorName -> shared Service: ", payload)
    return this.http.post('/searchByAuthorName', payload);
  }

  getUserBooksByID(payload){
    console.log("Inside getUserBooksByID -> shared Service: ", payload)
    return this.http.post('/getUserBooksByID', payload);
  }

  getAllBooksInRequest(){
    return this.http.get('/getAllBooksInRequest');
  }

  approveRejectBook(payload){
    return this.http.post('/approveRejectBook', payload);
  }

  returnBook(payload){
    return this.http.post('/returnBook', payload);
  }

  getAllBooks(){
    return this.http.get('/getAllBooks');
  }

  addBooksInRequestQueue(payload){
    return this.http.post('/addBooksInRequestQueue', payload);
  }
}
