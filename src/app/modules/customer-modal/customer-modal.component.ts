import { HttpClient } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Company } from 'src/app/_shared/company';
import { Customer } from 'src/app/_shared/customer';
import { VwCustomer } from 'src/app/_shared/vwcustomer';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-modal',
  templateUrl: './customer-modal.component.html',
  styleUrls: ['./customer-modal.component.css']
})
export class CustomerModalComponent implements OnInit {
  public ownerForm: FormGroup;
  companies: Company[];
  public http: HttpClient;
  //public baseUrl:string;
  private API_URL = environment.apiUrl;
  elem: any;

  constructor(public dialogRef: MatDialogRef<CustomerModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.elem = data.elem;
    this.http = http;
    //this.baseUrl = baseUrl;
  }

  ngOnInit() {
    this.ownerForm = new FormGroup({
      clientName: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      custId: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      custSoldTo: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      custShipTo: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      shipTo: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      barcode: new FormControl('', [Validators.required, Validators.maxLength(10)])
    });

    this.getCompany();

    if (this.elem != null) {
      this.ownerForm.get('clientName').setValue(this.elem.clientName)
      this.ownerForm.get('custId').setValue(this.elem.custId)
      this.ownerForm.get('custSoldTo').setValue(this.elem.custSoldTo)
      this.ownerForm.get('custShipTo').setValue(this.elem.custShipTo)
      this.ownerForm.get('shipTo').setValue(this.elem.shipTo)
      this.ownerForm.get('barcode').setValue(this.elem.barcode)
    }
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.ownerForm.controls[controlName].hasError(errorName);
  }
  public onCancel = () => {
    this.dialogRef.close({ event: 'close' });
  }

  public onClickSubmit(ownerFormValue: any) {
    if (this.ownerForm.valid) {
      if (this.elem === null) {
        this.createDriverRecord(ownerFormValue);
      } else {
        this.updateDriverRecord(ownerFormValue);
      }
    }
  }

  swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })

  getCompany() {
    this.http.get<Company[]>(this.API_URL + 'api/company').subscribe(result => {
      this.companies = result;
    }, error => {
      console.error(error);
    });
  }

  createDriverRecord(ownerFormValue) {

    var cust: Customer = new Customer()
    cust.clientName = ownerFormValue.clientName;
    cust.custId = ownerFormValue.custId;
    cust.custSoldTo = ownerFormValue.custSoldTo;
    cust.custShipTo = ownerFormValue.custShipTo;
    cust.shipTo = ownerFormValue.shipTo;
    cust.barcode = ownerFormValue.barcode;
    if (this.companies != null)
      cust.fk_companyId = this.companies[0].id;

    const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };

    this.http.post(this.API_URL + 'api/customer', cust,{headers})
      .subscribe(res => {
        this.dialogRef.close({ event: 'close' });
        this.swalWithBootstrapButtons.fire(
          'Created',
          'The customer record has been created.',
          'success'
        )

      }, () => {

      })
  }

  updateDriverRecord(ownerFormValue) {
    var cust: Customer = new Customer();
    cust.id= Number(this.elem.id);
    cust.clientName = ownerFormValue.clientName;
    cust.custId = ownerFormValue.custId;
    cust.custSoldTo = ownerFormValue.custSoldTo;
    cust.custShipTo = ownerFormValue.custShipTo;
    cust.shipTo = ownerFormValue.shipTo;
    cust.barcode = ownerFormValue.barcode;
    if (this.companies != null)
      cust.fk_companyId = this.companies[0].id;

    const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };

    this.http.put(this.API_URL + 'api/customer', cust, {headers})
      .subscribe(res => {
        this.dialogRef.close({ event: 'close' });
        this.swalWithBootstrapButtons.fire(
          'Updated',
          'The customer record has been updated.',
          'success'
        )
      }, () => {

      })
  }


}
