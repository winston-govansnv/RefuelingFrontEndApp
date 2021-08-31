import { HttpClient } from '@angular/common/http';
import { Optional } from '@angular/core';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuelTypeModel } from 'src/app/_shared/fueltypemodel';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fueltype-modal',
  templateUrl: './fueltype-modal.component.html',
  styleUrls: ['./fueltype-modal.component.css']
})
export class FueltypeModalComponent implements OnInit {


  public ownerForm: FormGroup;
  departments: FuelTypeModel[];
  public http: HttpClient;
  //public baseUrl:string;
  private API_URL = environment.apiUrl;
  elem: any;

  constructor(public dialogRef: MatDialogRef<FueltypeModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.elem = data.elem;
    console.log(this.elem)
    this.http = http;
    //this.baseUrl = baseUrl;
  }

  ngOnInit() {
    this.ownerForm = new FormGroup({
      fuelTypeName: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    });

    if (this.elem != null) {
      this.ownerForm.get('fuelTypeName').setValue(this.elem.fuelTypeName)
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
    var ft: FuelTypeModel = new FuelTypeModel();
    ft.fuelTypeName = ownerFormValue.fuelTypeName;

    const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
    this.http.post(this.API_URL + 'api/fueltype', ft, { headers })
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
    var ft: FuelTypeModel = new FuelTypeModel();
    ft.id = Number(this.elem.id);
    ft.fuelTypeName = ownerFormValue.fuelTypeName;

    const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
    this.http.put(this.API_URL + 'api/fueltype', ft, { headers })
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


}
