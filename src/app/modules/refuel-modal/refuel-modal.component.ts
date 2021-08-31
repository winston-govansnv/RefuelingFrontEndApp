import { HttpClient } from '@angular/common/http';
import { Inject, Optional } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DriverModel } from 'src/app/_shared/drivermodel';
import { FuelTruckModel } from 'src/app/_shared/fueltruckmodel';
import { VwFuelTruckModel } from 'src/app/_shared/vwfueltruck';
import { VwRefuel } from 'src/app/_shared/vwrefuel';
import { VwRefuelTank } from 'src/app/_shared/vwrefueltank';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { DriverModalComponent } from '../driver-modal/driver-modal.component';

@Component({
  selector: 'app-refuel-modal',
  templateUrl: './refuel-modal.component.html',
  styleUrls: ['./refuel-modal.component.css']
})
export class RefuelModalComponent implements OnInit {

  public ownerForm: FormGroup;
  departments: VwRefuel[];
  tanks: VwRefuelTank[];
  trucks: VwFuelTruckModel[];
  drivers: DriverModel[];
  public http:HttpClient; 
  //public baseUrl:string;
  private API_URL= environment.apiUrl;

  elem:any;

  constructor(public dialogRef: MatDialogRef<RefuelModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,http: HttpClient, @Inject('BASE_URL') baseUrl: string) { 
      this.elem = data.elem;   
      console.log(this.elem)
      this.http = http;
      //this.baseUrl = baseUrl;     
  }

  ngOnInit() {
    this.ownerForm = new FormGroup({
      truck: new FormControl('', [Validators.required]),
      driver: new FormControl('', [Validators.required]),
      tank: new FormControl('', [Validators.required]),
      grossliters: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    });

    this.getDrivers();
    this.getTrucks();
    this.getRefuelTanks();
  
    if(this.elem!=null){
      this.ownerForm.get('truck').setValue(this.elem.fk_truckId)
      this.ownerForm.get('driver').setValue(this.elem.fk_driverId)
      this.ownerForm.get('tank').setValue(this.elem.fk_refuelTankId)
      this.ownerForm.get('grossliters').setValue(this.elem.grossLiters)
    }
  }
  public hasError = (controlName: string, errorName: string) =>{
    return this.ownerForm.controls[controlName].hasError(errorName);
  }
  public onCancel = () => {
    this.dialogRef.close({ event: 'close'});    
  }

  swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })

  public onClickSubmit(ownerFormValue: any) {
    if (this.ownerForm.valid) {
      if(this.elem===null){       
        this.createRecord(ownerFormValue);   
      }else{        
        this.updateRecord(ownerFormValue);   
      }        
    }
  }
  
  createRecord(ownerFormValue){
    var data={'fk_truckId':ownerFormValue.truck,
              'fk_driverId': ownerFormValue.driver,
              'fk_refuelTankId':ownerFormValue.tank,
              'grossLiters': ownerFormValue.grossliters}

    this.http.post(this.API_URL+ 'api/refuel', data)
    .subscribe(res => {
      this.swalWithBootstrapButtons.fire(
        'Created',
        'The record has been created.',
        'success'
      )    
        this.dialogRef.close({ event: 'close'});   
    }, () => {
          
    })
 }

 updateRecord(ownerFormValue){
  var data={'id':this.elem.id,
            'fk_truckId':ownerFormValue.truck,
            'fk_driverId': ownerFormValue.driver,
            'fk_refuelTankId':ownerFormValue.tank,
            'grossLiters': ownerFormValue.grossliters}
  
  this.http.put(this.API_URL+'api/refuel', data)
  .subscribe(res => {
    this.swalWithBootstrapButtons.fire(
      'Updated',
      'The record has been updated.',
      'success'
    )    
      this.dialogRef.close({ event: 'close'});   
  }, () => {
        
  })
}


getRefuelTanks(){
  this.http.get<VwRefuelTank[]>(this.API_URL + 'api/refueltank').subscribe(result => {
    console.log(result)
      this.tanks= result;     
}, error => {           
      console.error(error);           
 });
}


getTrucks(){
  this.http.get<VwFuelTruckModel[]>(this.API_URL + 'api/fueltruck').subscribe(result => {
      this.trucks= result;     
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


}
