import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  res: any;
  temp: any;
  isChecked: boolean;
  recordsApproveArray = [];
  assets = [];
  //for testing //Siddhesh
  approveAssetsArray = [];
  rejectAssetsArray = [];

  // @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  status: any;
  payload: any;
  isApproved: boolean;
  isRejected: boolean;
  id: any;
  users=[];
  customer: any;
 
  constructor(private activatedRoute:ActivatedRoute, private sharedService:SharedService) { }

  ngOnInit() {
    //   this.dtTrigger.next();
    this.activatedRoute.params.subscribe(params => { this.id = params.id });
    console.log("uname",this.id)

    this.sharedService.getUserBooksByID({id: this.id}).subscribe((res: any) => {
      console.log("RES: ", res,res.username,res.length)
      for(var i=0;i<res.length;i++){
        console.log("RES{I}: ", res[i])
        // this.customer = this.users[0].username;
        console.log("username: ",this.customer)
        if(res.length==1){
          console.log("Inside IF BLOCK");
          this.users[i] = res[i];
          // this.dtTrigger.next();
        }else{
          console.log("Inside ELSE BLOCK");
          this.users[i] = JSON.parse(res[i]);
          // this.dtTrigger.next();
        }
      }
      this.users[0] = JSON.parse(res[0]);
      // this.dtTrigger.next();
      this.customer = this.users[0].username;
      console.log("username: ",this.customer)
      console.log("users: ", this.users)//,"||",JSON.stringify(this.users))
      this.dtTrigger.next();
    })

    //  this.initializeArray();
    
  }
  
  initializeArray(){
    
  }
      
    
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
    
  checkuncheckall() {
    for(let i=0; i<this.approveAssetsArray.length; i++){
      this.approveAssetsArray[i].status = 0;
    }
    for(let i=0; i<this.rejectAssetsArray.length; i++){
      this.rejectAssetsArray[i].status = 0;
    }


    for(let i=0; i<this.assets.length; i++){
      this.assets[i].status = 0;
    }
  }   
      
  submit(){
    console.log("this.approveAssetsArray: ", this.approveAssetsArray);
    console.log("this.rejectAssetsArray: ", this.rejectAssetsArray);

    var payload= this.approveAssetsArray.concat(this.rejectAssetsArray);
    console.log("Submit Payload:: ", payload);
  }
   
  reset() {
    this.recordsApproveArray = [];
    this.checkuncheckall();
    this.approveAssetsArray= [];
    this.rejectAssetsArray=[];
  }
}