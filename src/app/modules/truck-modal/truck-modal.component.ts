import { HttpClient } from '@angular/common/http';
import { Inject, Optional } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VWDepartment } from 'src/app/_shared/vwdepartment';
import { VwFuelTruckModel } from 'src/app/_shared/vwfueltruck';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-truck-modal',
  templateUrl: './truck-modal.component.html',
  styleUrls: ['./truck-modal.component.css']
})
export class TruckModalComponent implements OnInit {

  public ownerForm: FormGroup;
  departments: VWDepartment[];
  public http: HttpClient;
  //public baseUrl:string;
  private API_URL = environment.apiUrl;
  elem: any;

  constructor(public dialogRef: MatDialogRef<TruckModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.elem = data.elem;
    console.log(this.elem)
    this.http = http;
    //this.baseUrl = baseUrl;
  }

  ngOnInit() {
    this.ownerForm = new FormGroup({
      truckNumber: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      fuelCapacity: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      totalizerId: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      department: new FormControl('', [Validators.required, Validators.maxLength(10)])
    });

    this.getDepartments();

    if (this.elem != null) {
      this.ownerForm.get('truckNumber').setValue(this.elem.truckNumber)
      this.ownerForm.get('fuelCapacity').setValue(this.elem.fuelCapacity)
      this.ownerForm.get('totalizerId').setValue(this.elem.totalizerId)
      this.ownerForm.get('department').setValue(this.elem.fk_departmentId)
    }
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.ownerForm.controls[controlName].hasError(errorName);
  }
  public onCancel = () => {
    this.dialogRef.close({ event: 'close' });
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
      if (this.elem === null) {
        this.createRecord(ownerFormValue);
      } else {
        this.updateRecord(ownerFormValue);
      }
    }
  }

  createRecord(ownerFormValue) {
    var ftruck: VwFuelTruckModel = new VwFuelTruckModel();

    ftruck.truckNumber = ownerFormValue.truckNumber;
    ftruck.fuelCapacity = ownerFormValue.fuelCapacity;
    ftruck.totalizerId = ownerFormValue.totalizerId;
    ftruck.fk_departmentId = ownerFormValue.department;

    const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
    this.http.post(this.API_URL + 'api/fueltruck', ftruck, { headers })
      .subscribe(res => {
        this.swalWithBootstrapButtons.fire(
          'Created',
          'The record has been created.',
          'success'
        )
        this.dialogRef.close({ event: 'close' });
      }, () => {

      })
  }

  updateRecord(ownerFormValue) {
    var ftruck: VwFuelTruckModel = new VwFuelTruckModel();
    ftruck.id = Number(this.elem.id);
    ftruck.truckNumber = ownerFormValue.truckNumber;
    ftruck.fuelCapacity = ownerFormValue.fuelCapacity;
    ftruck.totalizerId = ownerFormValue.totalizerId;
    ftruck.fk_departmentId = ownerFormValue.department;

    const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
    this.http.put(this.API_URL + 'api/fueltruck', ftruck, { headers })
      .subscribe(res => {
        this.swalWithBootstrapButtons.fire(
          'Updated',
          'The record has been updated.',
          'success'
        )
        this.dialogRef.close({ event: 'close' });
      }, () => {

      })
  }

  getDepartments() {
    this.http.get<VWDepartment[]>(this.API_URL + 'api/department').subscribe(result => {
      this.departments = result;
    }, error => {
      console.error(error);
    });
  }
}
