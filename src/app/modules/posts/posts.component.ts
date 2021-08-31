import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Inject, OnInit,  ViewChild } from '@angular/core';
import {  FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as printJS from 'print-js';
import { tap } from 'rxjs/operators';
import { DeliveryReportPrint } from 'src/app/_shared/delivery-report-print';
import { DeliveryModel } from 'src/app/_shared/deliverymodel';
import { RefuleingHistory } from 'src/app/_shared/refuelinghistory';
import { environment } from 'src/environments/environment';
import { DeliveryModalComponent } from '../delivery-modal/delivery-modal.component';
import { RefuelModalComponent } from '../refuel-modal/refuel-modal.component';

let someJSONdata = [
  {
     name: 'John Doe',
     email: 'john@doe.com',
     phone: '111-111-1111'
  },
  {
     name: 'Barry Allen',
     email: 'barry@flash.com',
     phone: '222-222-2222'
  },
  {
     name: 'Cool Dude',
     email: 'cool@dude.com',
     phone: '333-333-3333'
  }
]

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit, AfterViewInit {

  myHistForm: FormGroup;
  public http:HttpClient;
  //public baseUrl:string;
  public history: RefuleingHistory[];
  startDate:Date = new Date();
  endDate:Date= new Date();
  dataSource:any;
  isValid:boolean=true;
  showLoading:boolean=false;
  noDataFound:boolean=false;
  breadcrumpPath:any;
  private API_URL= environment.apiUrl;

  displayedColumns: string[] = ['id', 'deliveryDate', 'truck', 'fuelStartTime','fuelEndTime','customer','driver','fuelType','numOfExtraPoints','fuelLiters','details'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string
  ,private formBuilder: FormBuilder,public matDialog: MatDialog,private activatedroute:ActivatedRoute,private router: Router,private datePipe: DatePipe) { 
    this.http = http;
   // this.baseUrl = baseUrl;
  }
  ngAfterViewInit(): void {
    this.search();
  }

  ngOnInit() {
    this.myHistForm = this.formBuilder.group({
      picker: ['', Validators.required],
      picker2: ['', Validators.required]
    });   

    this.myHistForm.get('picker').setValue(this.startDate)
    this.myHistForm.get('picker2').setValue(this.startDate)

    this.activatedroute.data.subscribe(data => {
      this.breadcrumpPath=data;
    });
  }


  search() {      
     // stop here if form is invalid
     if (this.myHistForm.invalid) {
      this.isValid=false;
      return;
    }
    
    this.startDate=  this.myHistForm.get('picker').value;
    this.endDate=  this.myHistForm.get('picker2').value;
    this.showLoading=true; 
    this.noDataFound=false;

    this.http.get<RefuleingHistory[]>(this.API_URL + 'api/refuelinghistory?start='+ this.startDate.toDateString()+'&&end='+ this.endDate.toDateString()).subscribe(result => {
         this.history = result;            
         this.dataSource = new MatTableDataSource<RefuleingHistory>(this.history);  
         if(result!=null)
          this.dataSource.paginator = this.paginator;    
        
         this.showLoading=false; 
         this.isValid=true;

         if(result==null)
           this.noDataFound=true;
   }, error => {
         this.showLoading=false; 
          console.error(error)             
    });
  }


  GetDelivery(deliveryId: any) {  
   console.log("deliveryId >>>"+ deliveryId)
    this.http.get<DeliveryModel[]>(this.API_URL + 'api/delivery?fuelDeliveryId='+ deliveryId).subscribe(result => {
        this.openModalDelivery(result);                  
   }, error => {
         this.showLoading=false; 
          console.error(error)             
    });
  }
  

  clear(){
    this.myHistForm.reset();
    this.history =null;  
    this.noDataFound=true;
    this.dataSource=null;
    this.isValid=true;
  }

  openModalDelivery(element:any) {
    const dialogRef = this.matDialog.open(DeliveryModalComponent, {
      
      width: '550px',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: 'custom-dialog-panel-class',
      disableClose: false,
      data: {elem:element }
    });

    dialogRef.afterClosed().subscribe(result => {
    
    });
  }

  print(){
    // window.print();
    // this.router.navigate(['/print/invoice']);
    var report : DeliveryReportPrint[]=[];

    if (Array.isArray(this.history)) {
      for (let i = 0; i < this.history.length; i++) {
        var item: DeliveryReportPrint = new DeliveryReportPrint();
        var r: any= this.history[i];
        console.log(r);
        item.no= i+1;
        item.customer= r.customer;
        var deliveryDateMedium = this.datePipe.transform(r.deliveryDate,"dd-MM-yyyy"); 
        item.deliveryDate= deliveryDateMedium; 
        var mediumStart = this.datePipe.transform(r.fuelStartTime,"h:mm a"); 
        item.startTime=  mediumStart;
        item.fueltype=r.fuelType; 
        item.liters= r.fuelLiters;
        item.driver= r.driver;
        item.truck= r.truck;
        report.push(item); 
      }
  } 

  printJS({printable: report, properties: ['no','deliveryDate','driver', 'truck', 'customer', 'startTime','fueltype','liters'], type: 'json', header: 'Fuel Delivery Report'});
  }

}
 