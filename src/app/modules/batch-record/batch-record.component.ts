import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BatchRecord } from 'src/app/_shared/batchrecord';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-batch-record',
  templateUrl: './batch-record.component.html',
  styleUrls: ['./batch-record.component.css']
})
export class BatchRecordComponent implements OnInit {
 
  @Input() startDate: Date;
  @Output() refreshComponents: EventEmitter<any>= new EventEmitter();

  public http:HttpClient; 
 // public baseUrl:string;
  private API_URL= environment.apiUrl;

  startDateTime: Date= new Date();

  displayedColumns: string[] = ['deliveryDate','numberOfPlannings', 'numberOfDeliveries', 'batchClosed','accept'];
  dataSource; 
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  swalWithBootstrapButtons: any;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
   //this.baseUrl = baseUrl; 
  }

  ngOnInit(): void {
    this.getBatchRecords(this.startDateTime);
  }
 
  forceRefresh(){    
    this.refreshComponents.emit();
  }
  
 getBatchRecords(startDateTime:Date){
  // console.log(startDateTime);
  this.http.get<BatchRecord[]>(this.API_URL + 'api/batchrecord?day='+ startDateTime.toDateString()).subscribe(result => {
      this.dataSource = new MatTableDataSource<BatchRecord>(result);  
      this.dataSource.paginator = this.paginator;    
}, error => {           
      console.error(error);           
 });
}

CreateRecord(){

  //console.log(this.startDate);
  var data = {'deliveryDate':this.startDate,'planningCount':0,'deliveryCount':0,'sumEstimatedRevenue':0,'SumActualRevenue':0};
//  console.log(JSON.stringify(data));

  this.http.post(this.API_URL+'api/closedbatch?day='+ this.startDateTime.toDateString(),data)
  .subscribe(res => {
    this.getBatchRecords(this.startDate);
    this.forceRefresh();
    this.swalWithBootstrapButtons.fire(
      'Created',
      'The record has been created.',
      'success'
    );       
  }, (err) => {
        console.log(err);
  })
}

closeBatch(){
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this action!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, close the batch!',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {      
        console.log('Closing the batch');
        this.CreateRecord();
      } else if (result.isDismissed) {
        console.log('Clicked No, no action will take place!');
      }
    })
}

}
