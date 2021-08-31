import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { BatchRecord } from 'src/app/_shared/batchrecord';
import { VwFuelDelivery } from 'src/app/_shared/viewfueldelivery';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { BatchRecordComponent } from '../batch-record/batch-record.component';
import { ReviewModalComponent } from '../review-modal/review-modal.component';

@Component({
  selector: 'app-review-batches',
  templateUrl: './review-batches.component.html',
  styleUrls: ['./review-batches.component.css']
})
export class ReviewBatchesComponent implements OnInit {
  myHistForm: FormGroup;
  public ownerForm: FormGroup;
  public http:HttpClient; 
  //public baseUrl:string;
  refuels: VwFuelDelivery[];
  startDate:Date = new Date();
  endDate:Date= new Date();
  breadcrumpPath:any;
  noDataFound:boolean;
  private API_URL= environment.apiUrl;

  @ViewChild('child') child:BatchRecordComponent;

  displayedColumns: string[] = ['id','deliveryDate','truckno', 'driver', 'customer','plannedvolume', 'fueltype', 'fuelvolume', 'actualstart', 'actualend','status','edit'];
  parentDataSource; 
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  
  constructor(private formBuilder: FormBuilder,public matDialog: MatDialog,http: HttpClient, @Inject('BASE_URL') baseUrl: string,private activatedroute:ActivatedRoute) {
      this.http = http;
      //this.baseUrl = baseUrl; 
   }

  ngOnInit() {
    this.myHistForm = this.formBuilder.group({
      picker: ['', Validators.required],
      picker2: ['', Validators.required]
    });   

    this.myHistForm.get('picker').setValue(this.startDate)
    this.myHistForm.get('picker2').setValue(this.startDate) 
    this.getList();

    this.activatedroute.data.subscribe(data => {
    this.breadcrumpPath=data;
  })
  }

getList(){
    this.startDate=  this.myHistForm.get('picker').value;
    

    this.http.get<VwFuelDelivery[]>(this.API_URL + 'api/dashboarddelivery?start='+ this.startDate.toDateString()).subscribe(result => {
      this.refuels=result;
      //console.log(result)
      this.parentDataSource = new MatTableDataSource<VwFuelDelivery>(this.refuels);  
      this.parentDataSource.paginator = this.paginator;   
      
      this.child.getBatchRecords(this.startDate);

      if(result.length===0){
        this.noDataFound=true;
      }else{
        this.noDataFound=false;          
      }                   
  }, error => {           
        console.error(error);           
   });
 }

itemSelected(element){
    this.openModalDriver(element) ;
}
 
openModalDriver(element) {

    const dialogRef = this.matDialog.open(ReviewModalComponent, {
      width: '560px',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: 'custom-dialog-panel-class',
      disableClose: true,
      data: {elem: element}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.child.getBatchRecords(this.startDate);
      this.getList();
    }); 
  }

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.parentDataSource.filter = filterValue.trim().toLowerCase();
}

swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})

}
