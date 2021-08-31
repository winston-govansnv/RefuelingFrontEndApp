import { HttpClient } from '@angular/common/http';
import { Optional } from '@angular/core';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuelTypeModel } from 'src/app/_shared/fueltypemodel';
import { VwFuelPrice } from 'src/app/_shared/vwfuelprice';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fuelprice-modal',
  templateUrl: './fuelprice-modal.component.html',
  styleUrls: ['./fuelprice-modal.component.css']
})
export class FuelpriceModalComponent implements OnInit {


  public ownerForm: FormGroup;
  fuelPrices: VwFuelPrice[];
  public http: HttpClient;
  //public baseUrl:string;
  private API_URL = environment.apiUrl;
  elem: any;

  constructor(public dialogRef: MatDialogRef<FuelpriceModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.elem = data.elem;
    this.http = http;
    //this.baseUrl = baseUrl;
  }

  ngOnInit() {
    this.ownerForm = new FormGroup({
      fuelTypeName: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      fuelPriceInAWG: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      fk_fuelTypeId: new FormControl('', [Validators.required]),
    });

    if (this.elem != null) {
      this.ownerForm.get('fuelTypeName').setValue(this.elem.fuelTypeName)
      this.ownerForm.get('fuelPriceInAWG').setValue(this.elem.fuelPriceInAWG)
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
        // this.createRecord(ownerFormValue);
      } else {
        this.updateRecord(ownerFormValue);
      }
    }
  }

  //   createRecord(ownerFormValue){
  //     const formData = new FormData();
  //     formData.append("fuelTypeName", ownerFormValue.fuelTypeName);

  //     this.http.post(this.API_URL+ 'api/fueltype', formData)
  //     .subscribe(res => {
  //       this.swalWithBootstrapButtons.fire(
  //         'Created',
  //         'The record has been created.',
  //         'success'
  //       )
  //         this.dialogRef.close({ event: 'close'});
  //     }, () => {

  //     })
  //  }

  updateRecord(ownerFormValue) {
    var fp: VwFuelPrice = new VwFuelPrice();
    fp.id = Number(this.elem.id);
    fp.fuelTypeName = ownerFormValue.fuelTypeName;
    fp.fuelPriceInAWG = ownerFormValue.fuelPriceInAWG;

    const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
    this.http.put(this.API_URL + 'api/fuelprice', fp, {headers})
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
