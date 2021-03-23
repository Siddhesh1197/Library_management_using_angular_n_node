import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit {

  bookName
  authorName
  publication
  price
  response: any;
  status: number;

  constructor(private sharedService:SharedService, private router:Router) { }

  ngOnInit() {
  
  }

  async submit(value){
    console.log("BOOK: ", value.BookName, value.AuthorName, value.Publication, value.Price);
    var payload = {
      "bookName": value.BookName,
      "authorName":value.AuthorName,
      "publication":value.Publication,
      "price":value.Price
    }
    this.sharedService.addBook(payload).subscribe((res: any) => {
      console.log("RES: ", res, res.status);
      if (res.status == 0) {
        this.status = 0;
        this.router.navigate(['adminList']);
      } else if (res.status == 1) {
        this.status = 1;
        delay(10000);
        this.router.navigate(['adminList']);
      }
    })    

  /* if(this.response.status==0){
    this.router.navigate(['adminList'])
  } */
  }

  reset(){
    this.bookName = '';
    this.authorName = '';
    this.publication = '';
    this.price = '';
  }
}
