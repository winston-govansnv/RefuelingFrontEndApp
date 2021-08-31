import { HttpClient } from '@angular/common/http';
import { Optional } from '@angular/core';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Department } from 'src/app/_shared/department';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-department-modal',
  templateUrl: './department-modal.component.html',
  styleUrls: ['./department-modal.component.css']
})
export class DepartmentModalComponent implements OnInit {

  public ownerForm: FormGroup;
  public http:HttpClient;
  //public baseUrl:string;
  private API_URL= environment.apiUrl;
  elem:any;


  constructor(public dialogRef: MatDialogRef<DepartmentModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
      this.elem = data.elem;
      this.http = http;
      //this.baseUrl = baseUrl;
  }

  ngOnInit() {
    this.ownerForm = new FormGroup({
      departmentname: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      address1: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      address2: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      postalcode: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      city: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      phone: new FormControl('', [Validators.required, Validators.maxLength(20)])
    });


    if(this.elem!=null){
      this.ownerForm.get('departmentname').setValue(this.elem.departmentName);
      this.ownerForm.get('address1').setValue(this.elem.address1);
      this.ownerForm.get('address2').setValue(this.elem.address2);
      this.ownerForm.get('postalcode').setValue(this.elem.postalCode);
      this.ownerForm.get('city').setValue(this.elem.city);
      this.ownerForm.get('phone').setValue(this.elem.phone);
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

    var dep: Department = new Department()
    dep.departmentName= ownerFormValue.departmentname;
    dep.address1= ownerFormValue.address1;
    dep.address2= ownerFormValue.address2;
    dep.postalCode= ownerFormValue.postalcode;
    dep.city= ownerFormValue.city;
    dep.phone= ownerFormValue.phone;

    const headers = { 'Content-Type': 'application/json', 'Accept':'application/json' };
    this.http.post(this.API_URL+ 'api/department', dep, {headers})
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

  var dep: Department = new Department()
  dep.id= Number(this.elem.id);
  dep.departmentName= ownerFormValue.departmentname;
  dep.address1= ownerFormValue.address1;
  dep.address2= ownerFormValue.address2;
  dep.postalCode= ownerFormValue.postalcode;
  dep.city= ownerFormValue.city;
  dep.phone= ownerFormValue.phone;


  const headers = { 'Content-Type': 'application/json', 'Accept':'application/json' };

  this.http.put<Department>(this.API_URL+ 'api/department', dep, {headers})
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

}
