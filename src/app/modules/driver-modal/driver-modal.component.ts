import { HttpClient } from '@angular/common/http';
import { Optional, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Driver } from 'src/app/_shared/driver';
import { VWDepartment } from 'src/app/_shared/vwdepartment';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-driver-modal',
  templateUrl: './driver-modal.component.html',
  styleUrls: ['./driver-modal.component.css']
})
export class DriverModalComponent implements OnInit {
  public ownerForm: FormGroup;
  departments: VWDepartment[];
  public http: HttpClient;
  //public baseUrl:string;
  private API_URL = environment.apiUrl;
  elem: any;

  constructor(public dialogRef: MatDialogRef<DriverModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.elem = data.elem;
    this.http = http;
    //this.baseUrl = baseUrl;
  }

  ngOnInit() {
    this.ownerForm = new FormGroup({
      firstname: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      lastname: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      badgeNumber: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      department: new FormControl('', [Validators.required, Validators.maxLength(10)])
    });

    this.getDepartments();

    if (this.elem != null) {
      this.ownerForm.get('firstname').setValue(this.elem.firstname)
      this.ownerForm.get('lastname').setValue(this.elem.lastname)
      this.ownerForm.get('badgeNumber').setValue(this.elem.badgeNumber)
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
        this.createDriverRecord(ownerFormValue);
      } else {
        this.updateDriverRecord(ownerFormValue);
      }
    }
  }

  createDriverRecord(ownerFormValue) {
    var driver: Driver = new Driver()
    driver.firstname = ownerFormValue.firstname;
    driver.lastname = ownerFormValue.lastname;
    driver.badgeNumber = ""+ownerFormValue.badgeNumber;
    driver.fk_departmentId = ownerFormValue.department;

    const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
    this.http.post(this.API_URL + 'api/driver', driver, { headers })
      .subscribe(res => {
        this.swalWithBootstrapButtons.fire(
          'Created',
          'The driver record has been created.',
          'success'
        )

        this.dialogRef.close({ event: 'close' });
        // console.log("result :"+ res);
      }, () => {

      })
  }

  updateDriverRecord(ownerFormValue) {

    var driver: Driver = new Driver()
    driver.id = this.elem.id;
    driver.firstname = ownerFormValue.firstname;
    driver.lastname = ownerFormValue.lastname;
    driver.badgeNumber = ownerFormValue.badgeNumber;
    driver.fk_departmentId = ownerFormValue.department;

    const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };

    this.http.put(this.API_URL + 'api/driver', driver, { headers })
      .subscribe(res => {
        this.swalWithBootstrapButtons.fire(
          'Updated',
          'The driver record has been updated.',
          'success'
        )

        this.dialogRef.close({ event: 'close' });
        // console.log("result :"+ res);
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
