import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http:HttpClient) { }

  login(payload){
    console.log("Inside LOGIN of SERVICE : ", payload);
    return this.http.post('/login', payload);
  }

  register(payload){
    console.log("Inside REGISTER of SERVICE : ", payload);
    return this.http.post('/register', payload);
  }
}
