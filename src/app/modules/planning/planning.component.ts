import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import {  FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { DxSchedulerComponent } from 'devextreme-angular';
import Query from 'devextreme/data/query';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';  
import { Service } from 'src/app/_services/planning.service';
import { CustomerModel } from 'src/app/_shared/customermodel';
import { DeliveryPlanning } from 'src/app/_shared/deliveryplanning';
import { DriverModel } from 'src/app/_shared/drivermodel';
import { FuelTruckModel } from 'src/app/_shared/fueltruckmodel'; 
import { FuelTypeModel } from 'src/app/_shared/fueltypemodel';
import { PlanningReportModalComponent } from '../planning-report-modal/planning-report-modal.component';
import { CustomerModalComponent } from '../customer-modal/customer-modal.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

export interface Brand {
  value: string;
  viewValue: string;
}

export interface Fuels {
    value: string;
    viewValue: string;
  }

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.css']
})
export class PlanningComponent implements OnInit, AfterViewInit {

    @ViewChild('content') content: ElementRef;

    displayedColumns: string[] = ['deliverydate','customer','deliverystarttime','deliveryendtime','truck','fuelTypeName','release'];
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
     @ViewChild(DxSchedulerComponent, { static: false }) scheduler: DxSchedulerComponent;
     myHistForm: FormGroup;
     data: any;
     currentDate: Date = new Date();
     deliveryPlanning: DeliveryPlanning[];
     fueltypes: FuelTypeModel[];
     customers: CustomerModel[];
     drivers: DriverModel[];
     trucks: FuelTruckModel[];
     deleted:boolean=false;
     public http:HttpClient; 
     //public baseUrl:string;
     startDate:Date = new Date();
     endDate:Date= new Date();
     dataSource:any;
     fuelTypeActive: string;
     rules: any;
     noDataPresent:boolean=true;
     breadcrumpPath:any;
     private API_URL= environment.apiUrl;
 

  constructor(public matDialog: MatDialog,http: HttpClient, service: Service, 
    @Inject('BASE_URL') baseUrl: string,public datepipe: DatePipe,private activatedroute:ActivatedRoute) {      
       this.http = http;
       //this.baseUrl = baseUrl;      
       this.rules = { "X": /[02-9]/ };
  }
  
  ngOnInit(): void {
    this.myHistForm = new FormGroup({
        trucks: new FormControl('', Validators.required)       
      });    
      
      this.activatedroute.data.subscribe(data => {
        this.breadcrumpPath=data;
      });

      this.startDate= new Date();
      this.endDate= new Date();
  } 

  ngAfterViewInit(): void {     
    this.scheduler.disabled=true; 
    this.getTrucks();
  }

  onAppointmentFormDeleting(data) {
      this.deleteAppointment(data);
  }


/******
 * Handle in this section all event calls releated to the scheduler
 */
getAppointmentList(truckName:string) {
     var apiUrl=this.API_URL + 'api/deliveryplanning?start='+ this.startDate.toDateString()+'&&end='+ this.endDate.toDateString()+ '&&truckNumber='+ truckName;
     const promise = this.http.get(apiUrl).toPromise();
     promise.then((data)=>{
         this.data= data;
        //  if(data!=null)
        //     console.log("Promise resolved with: " + JSON.stringify(data));        
     }, (error)=>{
         console.log("Promise rejected with " + JSON.stringify(error));
     })
 }

 swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success'
    },
    buttonsStyling: false
  })

  deleteAppointment(data) {    
    var id=data.appointmentData.id;
    this.http.delete(this.API_URL + 'api/deliveryplanning?id='+ id)
    .subscribe({
        next: data => {
            this.refreshComponents()
            if(data ==false){
                this.swalWithBootstrapButtons.fire(
                    'Warning',
                    'The record could not be removed.',
                    'warning'
                  )    
            }
           
        },
        error: error => {
            this.swalWithBootstrapButtons.fire(
                'Error',
                'The record could not be removed.',
                'success'
              )    
            this.refreshComponents();
        }
    });
}


getDataObj(objData) {
    for(var i = 0; i < this.data.length; i++) {
        if(this.data[i].estimatedDeliveryStartTime.getTime() === objData.startDate.getTime() )
            return this.data[i];
    }
    return null;
}

getPlanningById(id) {
    return Query(this.data).filter(["id", "=", id]).toArray()[0];
}

onAppointmentFormAdding(data: any) {
   data.truckNumber = this.myHistForm.get('trucks').value;
   this.createPlanningRecord(data);
   
}
convertDateTime(date: Date){
    var stringvalue =this.datepipe.transform(date, 'yyyy-MM-dd HH:mm:ss') ; 
    return stringvalue;
}


createPlanningRecord(planningRecord: any){
    const formData = new FormData();    

    var std=this.convertDateTime(planningRecord.appointmentData.startDate);
    var ed=this.convertDateTime(planningRecord.appointmentData.endDate);
    formData.append("truckNumber", planningRecord.truckNumber);
    formData.append("driverId", planningRecord.appointmentData.driverId);
    formData.append("clientId", planningRecord.appointmentData.clientId);
    formData.append("startDate", std);
    formData.append("endDate", ed);
    formData.append("fuelTypeId", planningRecord.appointmentData.fuelTypeId);
    formData.append("deliverVolume", planningRecord.appointmentData.deliverVolume);
    
    this.http.post(this.API_URL+ 'api/deliveryplanning', formData)
    .subscribe(res => {
        this.refreshComponents();
       // console.log("result :"+ res);
    }, () => {
          
    })
 }


 onAppointmentFormUpdating(data: any) {
    data.truckNumber = this.myHistForm.get('trucks').value;

    var std=this.convertDateTime(data.newData.startDate);
    
    var ed=this.convertDateTime(data.newData.endDate);

  //  console.log(data);
    const formData = new FormData();    
    formData.append("id", data.newData.id);
    formData.append("truckNumber", data.newData.truckNumber);
    formData.append("driverId", data.newData.driverId);
    formData.append("clientId", data.newData.clientId);
    formData.append("startDate", std);
    formData.append("endDate", ed);
    formData.append("fuelTypeId", data.newData.fuelTypeId);
    formData.append("deliverVolume", data.newData.deliverVolume);
    
    this.http.put(this.API_URL+'api/deliveryplanning', formData)
    .subscribe(res => {
        this.refreshComponents();
        //console.log("result :"+ res);
    }, () => {
          
    })
 } 

 onAppointmentFormRendered(data: any) {
    this.startDate = data;
    this.endDate = data;
    this.refreshComponents();
 }


 onAppointmentFormOpening(data) {
    var that = this,
        form = data.form,
        dataInfo = data.appointmentData || {};
        var startDate: Date = data.appointmentData.startDate ;
        var hours  = 1 * 60 * 60 * 1000; //1 hour 

    form.option("items", [{
        label: {
            text: "Customer"
        },
        editorType: "dxSelectBox",
        dataField: "clientId",
        editorOptions: {
            items: that.customers,
            displayExpr: "clientName",
            valueExpr: "id"
        }
    },   {
        label: {
            text: " Driver name"
        },
        name: "driver", 
        editorType: "dxSelectBox",
        dataField: "driverId",
        editorOptions: {
            items: that.drivers,
            displayExpr: "fullname",
            valueExpr: "id"
        }
    }, {
        dataField: "startDate",
        editorType: "dxDateBox",
        editorOptions: {
            width: "100%",
            type: "datetime",
            onValueChanged: function(args) {
                startDate = args.value;
                form.getEditor("endDate")
                    .option("value", startDate.getTime()+ hours);
            }
        }
    }, {
        name: "endDate",
        dataField: "endDate",
        editorType: "dxDateBox",
        editorOptions: {
            width: "100%",
            type: "datetime",
            readOnly: false
        }
    }, 
    {
        label: {
            text: "Fuel type"
        },
        name: "fuel", 
        editorType: "dxSelectBox",
        dataField: "fuelTypeId",
        editorOptions: {
            items: that.fueltypes,
            displayExpr: "fuelTypeName",
            valueExpr: "id"
        }
    }
    , {
        label: {
            text: "Fueling amount"
        },
        name: "volume",
        dataField: "deliverVolume",
        editorType: "dxNumberBox",
        editorOptions: {            
            readOnly: false,
            maskRules: that.rules
        }
    }
    ]);
}


 /***********************************
  * *********************************
  * ********************************* */
 

 /****************
  * Resources 
  ****************/
 refreshComponents(){   
    this.scheduler.disabled=false;  
    var truckName =  this.myHistForm.get('trucks').value;
    this.getDrivers();
    this.getCustomers();
    this.getFuelList();

    this.getAppointmentList(truckName);
    this.getDeliveryPlanningList();  
    this.getCustomers();
 }

getTrucks(){
    this.http.get<FuelTruckModel[]>(this.API_URL + 'api/fueltruck').subscribe(result => {
        console.log(result)
        this.trucks= result;   
        this.myHistForm.get('trucks').setValue(result[0].truckNumber)
        this.refreshComponents();
  }, error => {           
        console.error(error);           
   });
 }

 getFuelList(){
    this.http.get<FuelTypeModel[]>(this.API_URL + 'api/fueltype?clientId='+ 253).subscribe(result => {
        this.fueltypes= result;      
  }, error => {           
        console.error(error);           
   });
 }

 getCustomers(){
    this.http.get<CustomerModel[]>(this.API_URL + 'api/customer').subscribe(result => {
        this.customers= result;   
  }, error => {           
        console.error(error);           
   }); 
 }
   
 getDrivers(){
    this.http.get<DriverModel[]>(this.API_URL + 'api/driver').subscribe(result => {
        this.drivers= result;   
  }, error => {           
        console.error(error);           
   });
 }



 getDeliveryPlanningList(){
    this.data= null;
    var obj:DeliveryPlanning[];
    this.dataSource = new MatTableDataSource<DeliveryPlanning>(obj);  
    this.dataSource.paginator = this.paginator;           

    var truckName =  this.myHistForm.get('trucks').value;
    this.http.get<DeliveryPlanning[]>(this.API_URL + 'api/deliveryplanning?start='+ this.startDate.toDateString()+'&&end='+ this.endDate.toDateString()+ '&&truckNumber='+ truckName).subscribe(result => {
        if(result!=null){
            console.log(result)
            this.data= result
            this.noDataPresent=false;
            this.deliveryPlanning= result;      
            this.dataSource = new MatTableDataSource<DeliveryPlanning>(this.deliveryPlanning);  
            this.dataSource.paginator = this.paginator;           
            this.fuelTypeActive=result[0].fuelTypeName;
        }else{
            this.data= {};
            this.noDataPresent=true;
         
        }
        
  }, error => {           
        console.error(error);           
   });
 }

 openReportModal(){
    const dialogRef = this.matDialog.open(PlanningReportModalComponent, {
        width: '1000px',
        backdropClass: 'custom-dialog-backdrop-class',
        panelClass: 'custom-dialog-panel-class',
        disableClose: false,
      });
  
      dialogRef.afterClosed().subscribe(result => {
      });
 }

}
