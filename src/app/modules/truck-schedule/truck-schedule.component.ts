import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as printJS from 'print-js';
import { DriverReportPrint } from 'src/app/_shared/driver-report-print';
import { DriverModel } from 'src/app/_shared/drivermodel';
import { FuelTruckModel } from 'src/app/_shared/fueltruckmodel';
import { VwDriverSchedule } from 'src/app/_shared/vwdriverschedule';
import { VwFuelTruckSchedule } from 'src/app/_shared/vwfueltruckschedule';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-truck-schedule',
  templateUrl: './truck-schedule.component.html',
  styleUrls: ['./truck-schedule.component.css']
})
export class TruckScheduleComponent implements OnInit {

  
  myHistForm: FormGroup;
  public http:HttpClient;
  //public baseUrl:string;
  public history: VwFuelTruckSchedule[];
  startDate:Date = new Date();
  endDate:Date= new Date();
  trucks: FuelTruckModel[];
  dataSource:any;
  isValid:boolean=true;
  showLoading:boolean=false;
  noDataFound:boolean=true;
  breadcrumpPath:any;
  private API_URL= environment.apiUrl;

  displayedColumns: string[] = ['id','deliveryDate','truckNumber','badgeNumber','driver','truck','customer', 'est-starttime','est-endtime','fuelType','volume'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string
  ,private formBuilder: FormBuilder,public matDialog: MatDialog,private activatedroute:ActivatedRoute,private router: Router,private datePipe: DatePipe) { 
    this.http = http;
   // this.baseUrl = baseUrl;
  }
  ngAfterViewInit(): void {
   // this.search();
  }

  ngOnInit() {
    this.myHistForm = this.formBuilder.group({
      trucks: ['', Validators.required],
      picker: ['', Validators.required],
      picker2: ['', Validators.required]
    });   

    this.myHistForm.get('picker').setValue(this.startDate)
    this.myHistForm.get('picker2').setValue(this.startDate)

    this.activatedroute.data.subscribe(data => {
      this.breadcrumpPath=data;
    });
    this.getTrucks();
  }


  search() {      
     // stop here if form is invalid
     if (this.myHistForm.invalid) {
      this.isValid=false;
      return;
    }
    
    this.startDate=  this.myHistForm.get('picker').value;
    this.endDate=  this.myHistForm.get('picker2').value;
    var truckId = this.myHistForm.get('trucks').value;
    this.showLoading=true; 
    this.noDataFound=false;

    this.http.get<VwFuelTruckSchedule[]>(this.API_URL + 'api/FuelTruckSchedule?start='+ this.startDate.toDateString()+'&&end='+ this.endDate.toDateString() +'&&fuelTruckId='+ truckId).subscribe(result => {
        this.showLoading=false; 
        this.isValid=true;
        this.history = result;            
        this.dataSource = new MatTableDataSource<VwFuelTruckSchedule>(this.history);  
         if(result!=null)
          this.dataSource.paginator = this.paginator;    

         if(result==null)
           this.noDataFound=true; 

        if(result!=null && result.length==0)
        this.noDataFound=true;

   }, error => {
         this.showLoading=false;   
          console.error(error)             
    });
  }

  getTrucks(){
    this.http.get<FuelTruckModel[]>(this.API_URL + 'api/fueltruck').subscribe(result => {
        this.trucks= result;   
  }, error => {           
        console.error(error);           
   });
  }
  
  clear(){
    this.myHistForm.reset();
    this.history =null;  
    this.noDataFound=true;
    this.dataSource=null;
    this.isValid=true;
  }

  print(){
    var report : DriverReportPrint[]=[];

    if (Array.isArray(this.history)) {
      for (let i = 0; i < this.history.length; i++) {
        var item: DriverReportPrint = new DriverReportPrint();
        var r: VwFuelTruckSchedule= this.history[i];
        item.no= i+1;
        item.customer= r.clientName;
        var deliveryDateMedium = this.datePipe.transform(r.deliveryDate,"dd-MM-yyyy"); 
        item.deliveryDate= deliveryDateMedium; 
        var mediumStart = this.datePipe.transform(r.estimatedDeliveryStartTime,"h:mm a"); 
        item.startTime=  mediumStart;
        item.fueltype=r.fuelTypeName; 
        item.liters= r.toDeliveryVolume;
        item.driver= r.driver;
        item.truck= r.truckNumber;
        report.push(item); 
      }
  } 

  printJS({printable: report, properties: ['no','deliveryDate','driver', 'truck', 'customer', 'startTime','fueltype','liters'], type: 'json', header: 'Driver Schedule Report'});
  }



}
