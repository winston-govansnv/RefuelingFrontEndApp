import { HttpClient } from '@angular/common/http';
import { Inject, Optional } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VwFuelDelivery } from 'src/app/_shared/viewfueldelivery';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-review-modal',
  templateUrl: './review-modal.component.html',
  styleUrls: ['./review-modal.component.css']
})
export class ReviewModalComponent implements OnInit {

  public ownerForm: FormGroup;
  public http:HttpClient; 
  //public baseUrl:string;
  private API_URL= environment.apiUrl;
  elem:any;

  constructor(public dialogRef: MatDialogRef<VwFuelDelivery>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,http: HttpClient, @Inject('BASE_URL') baseUrl: string) { 
      this.elem = data.elem;   
      console.log(this.elem)
      this.http = http;
     // this.baseUrl = baseUrl;     
  }

  ngOnInit() {
    this.ownerForm = new FormGroup({
      start: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      end: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      id: new FormControl('', [Validators.required]),
      truck: new FormControl('', [Validators.required]),
      customer: new FormControl('', [Validators.required]),
      meterOpen: new FormControl('', [Validators.required, Validators.min(10)]),
      meterClose: new FormControl('', [Validators.required, Validators.min(10)]),
      extraPoints: new FormControl('', [Validators.required]),
    });

    if(this.elem!=null){
      //console.log(this.elem)
      this.ownerForm.get('start').setValue((this.elem.totalFueled>0)?this.elem.startTime: new Date())
      this.ownerForm.get('end').setValue((this.elem.totalFueled>0)?this.elem.endTime: new Date())
      this.ownerForm.get('truck').setValue(this.elem.truckNumber)
      this.ownerForm.get('customer').setValue(this.elem.clientName)
      this.ownerForm.get('meterOpen').setValue(this.elem.meterOpen)
      this.ownerForm.get('meterClose').setValue(this.elem.meterClose)
      this.ownerForm.get('extraPoints').setValue(this.elem.extraPoints)
      this.ownerForm.get('id').setValue(this.elem.id)
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
      if(this.elem.fuelDeliveryId==0) {
        this.CreateRecord(ownerFormValue);    
      }else{
        this.UpdateRecord(ownerFormValue);    
      }                    
    }
  }
  

 CreateRecord(ownerFormValue){
  const formData = new FormData();   
  
  var now = new Date();
  var offset= now.getTimezoneOffset();
  var startDate = new Date(ownerFormValue.start);
  startDate.setHours(startDate.getHours()-(offset/60));

  var endDate = new Date(ownerFormValue.end);
  endDate.setHours(endDate.getHours()-(offset/60));

  var data = {'fk_deliveryPlanningId':this.elem.id
              ,'startTime': startDate
              ,'endTime': endDate
              ,'totalFueled':ownerFormValue.volume
              ,'delivered':ownerFormValue.statusid
              ,'meterOpen':ownerFormValue.meterOpen
              ,'meterClose': ownerFormValue.meterClose
              ,'extraPoints':ownerFormValue.extraPoints
            };

  //console.log(JSON.stringify(data));

  this.http.post(this.API_URL+'api/fueldelivery', data)
  .subscribe(res => {
    this.swalWithBootstrapButtons.fire(
      'Created',
      'The record has been created.',
      'success'
    );   
    
    this.dialogRef.close({ event: 'close'});   
  }, (err) => {
        console.log(err);
  })
}

UpdateRecord(ownerFormValue){
  const formData = new FormData();   
  
  var now = new Date();
  var offset= now.getTimezoneOffset();
  var startDate = new Date(ownerFormValue.start);
  startDate.setHours(startDate.getHours()-(offset/60));
  var endDate = new Date(ownerFormValue.end);
  endDate.setHours(endDate.getHours()-(offset/60));

  var data = {'id': this.elem.fuelDeliveryId
              ,'fk_deliveryPlanningId':this.elem.id
              ,'startTime': startDate
              ,'endTime': endDate
              ,'totalFueled':ownerFormValue.volume
              ,'delivered':ownerFormValue.statusid
              ,'meterOpen':ownerFormValue.meterOpen
              ,'meterClose': ownerFormValue.meterClose
              ,'extraPoints':ownerFormValue.extraPoints
            };

  ///console.log(JSON.stringify(data));

  this.http.put(this.API_URL+ 'api/fueldelivery', data)
  .subscribe(res => {
    this.swalWithBootstrapButtons.fire(
      'Updated',
      'The record has been updated.',
      'success'
    );    
    
    this.dialogRef.close({ event: 'close'});   
  }, (err) => {
        console.log(err);
  })
}

}