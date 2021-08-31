import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { FuelTruckModel } from 'src/app/_shared/fueltruckmodel';
import { VwFuelDelivery } from 'src/app/_shared/viewfueldelivery';
import { VwFuelPrice } from 'src/app/_shared/vwfuelprice';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-dashboard-delivery',
  templateUrl: './dashboard-delivery.component.html',
  styleUrls: ['./dashboard-delivery.component.css']
})
export class DashboardDeliveryComponent implements OnInit {
  myHistForm: FormGroup;
  public http:HttpClient; 
  //public baseUrl:string;
  noDataFound:boolean;
  trucks: FuelTruckModel[];
  deliveries: VwFuelDelivery[];
  startDate:Date = new Date();
  breadcrumpPath:any;
  private API_URL= environment.apiUrl;

  displayedColumns: string[] = ['id','deliveryDate','truckno', 'driver', 'customer', 'fueltype', 'plannedvolume','estimatedCost', 'fuelvolume', 'estimatedstart', 'actualstart','bar'];
  dataSource;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  
  constructor(http: HttpClient,  @Inject('BASE_URL') baseUrl: string,private activatedroute:ActivatedRoute) { 
    this.http = http;
    //this.baseUrl = baseUrl;  
  }

  ngOnInit(): void {
    this.myHistForm = new FormGroup({
      trucks: new FormControl('', Validators.required),
      picker: new FormControl('', Validators.required),
    }); 

    this.getTrucks();
    this.myHistForm.get('picker').setValue(this.startDate)
    this.getList();

    this.activatedroute.data.subscribe(data => {
      this.breadcrumpPath=data;
    });
  }

  getList(){
    var truckId = this.startDate=  this.myHistForm.get('trucks').value;
    this.startDate=  this.myHistForm.get('picker').value;
    this.http.get<VwFuelDelivery[]>(this.API_URL + 'api/dashboarddelivery?start='+ this.startDate.toDateString()+'&&truckId='+ truckId).subscribe(result => {
    //  console.log(result);
        if(result.length===0){
          this.noDataFound=true;
        }else{
          this.noDataFound=false;          
        }               
        this.dataSource = new MatTableDataSource<VwFuelDelivery>(result);  
        this.dataSource.paginator = this.paginator;    
  }, error => {           
        console.error(error);           
   });
 }

  
getTrucks(){
  this.http.get<FuelTruckModel[]>(this.API_URL + 'api/fueltruck').subscribe(result => {
      this.trucks= result;   
}, error => {           
      console.error(error);           
 });
}
}

export interface PeriodicElement {
  truckno: string;
  driver: string;
  customer: string;
  fueltype: string;
  fuelvolume: string;
  estimatedstart: string;
  actualstart: string; 
}

const ELEMENT_DATA: PeriodicElement[] = [
  {truckno:'DT-260', driver: 'Karel Mercera', customer: 'ANTRACO ARUBA N.V.', fueltype: 'Diesel',fuelvolume:'4000',estimatedstart:'29-10-2020 11:00am',actualstart:'29-10-2020 11:45am'},
  {truckno:'DT-340', driver: 'Alfredo Penha', customer: 'ARCO.', fueltype: '95-COM',fuelvolume:'6000',estimatedstart:'29-10-2020 11:30am',actualstart:'29-10-2020 11:55am'},
  {truckno:'DT-17', driver: 'Alfredo Penha', customer: 'ARCO.', fueltype: '95-COM',fuelvolume:'6000',estimatedstart:'29-10-2020 11:30am',actualstart:'29-10-2020 11:55am'},
  {truckno:'DT-458', driver: 'Alfredo Penha', customer: 'ARCO.', fueltype: '95-COM',fuelvolume:'6000',estimatedstart:'29-10-2020 11:30am',actualstart:'29-10-2020 11:55am'},
  {truckno:'DT-260', driver: 'Karel Mercera', customer: 'ANTRACO ARUBA N.V.', fueltype: 'Diesel',fuelvolume:'4000',estimatedstart:'29-10-2020 11:00am',actualstart:'29-10-2020 11:45am'},
  {truckno:'DT-340', driver: 'Alfredo Penha', customer: 'ARCO.', fueltype: '95-COM',fuelvolume:'6000',estimatedstart:'29-10-2020 11:30am',actualstart:'29-10-2020 11:55am'},
  {truckno:'DT-17', driver: 'Alfredo Penha', customer: 'ARCO.', fueltype: '95-COM',fuelvolume:'6000',estimatedstart:'29-10-2020 11:30am',actualstart:'29-10-2020 11:55am'},
  {truckno:'DT-458', driver: 'Alfredo Penha', customer: 'ARCO.', fueltype: '95-COM',fuelvolume:'6000',estimatedstart:'29-10-2020 11:30am',actualstart:'29-10-2020 11:55am'},  {truckno:'DT-260', driver: 'Karel Mercera', customer: 'ANTRACO ARUBA N.V.', fueltype: 'Diesel',fuelvolume:'4000',estimatedstart:'29-10-2020 11:00am',actualstart:'29-10-2020 11:45am'},
  {truckno:'DT-340', driver: 'Alfredo Penha', customer: 'ARCO.', fueltype: '95-COM',fuelvolume:'6000',estimatedstart:'29-10-2020 11:30am',actualstart:'29-10-2020 11:55am'},
  {truckno:'DT-17', driver: 'Alfredo Penha', customer: 'ARCO.', fueltype: '95-COM',fuelvolume:'6000',estimatedstart:'29-10-2020 11:30am',actualstart:'29-10-2020 11:55am'},
  {truckno:'DT-458', driver: 'Alfredo Penha', customer: 'ARCO.', fueltype: '95-COM',fuelvolume:'6000',estimatedstart:'29-10-2020 11:30am',actualstart:'29-10-2020 11:55am'},  {truckno:'DT-260', driver: 'Karel Mercera', customer: 'ANTRACO ARUBA N.V.', fueltype: 'Diesel',fuelvolume:'4000',estimatedstart:'29-10-2020 11:00am',actualstart:'29-10-2020 11:45am'},
  {truckno:'DT-340', driver: 'Alfredo Penha', customer: 'ARCO.', fueltype: '95-COM',fuelvolume:'6000',estimatedstart:'29-10-2020 11:30am',actualstart:'29-10-2020 11:55am'},
  {truckno:'DT-17', driver: 'Alfredo Penha', customer: 'ARCO.', fueltype: '95-COM',fuelvolume:'6000',estimatedstart:'29-10-2020 11:30am',actualstart:'29-10-2020 11:55am'},
  {truckno:'DT-458', driver: 'Alfredo Penha', customer: 'ARCO.', fueltype: '95-COM',fuelvolume:'6000',estimatedstart:'29-10-2020 11:30am',actualstart:'29-10-2020 11:55am'},
  
];
