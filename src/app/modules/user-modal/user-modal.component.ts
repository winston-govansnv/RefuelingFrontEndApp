import { HttpClient } from '@angular/common/http';
import { Optional } from '@angular/core';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmPasswordValidator } from 'src/app/_helpers/confirm-password.validator';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css']
})
export class UserModalComponent implements OnInit {

  public ownerForm: FormGroup;
  public http:HttpClient; 
  //public baseUrl:string;
  private API_URL= environment.apiUrl;
  elem:any;

  constructor(public dialogRef: MatDialogRef<UserModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,http: HttpClient, @Inject('BASE_URL') baseUrl: string,private fb: FormBuilder) { 
      this.elem = data.elem;   
      console.log(this.elem)
      this.http = http;
      //this.baseUrl = baseUrl;     
  }

  ngOnInit() { 
    this.ownerForm = this.fb.group({
      firstname: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      lastname: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      username: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      email: new FormControl('', [Validators.required, Validators.maxLength(50),, Validators.email]),
    });

    if(this.elem!=null){
      this.ownerForm.get('firstname').setValue(this.elem.firstname)
      this.ownerForm.get('lastname').setValue(this.elem.lastname)
      this.ownerForm.get('username').setValue(this.elem.username)
      this.ownerForm.get('email').setValue(this.elem.email)
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

  get f(){
    return this.ownerForm.controls;
  }

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
    const formData = new FormData();    
    formData.append("firstname", ownerFormValue.firstname);
    formData.append("lastname", ownerFormValue.lastname);
    formData.append("username", ownerFormValue.username);
    formData.append("email", ownerFormValue.email);

    this.http.post(this.API_URL+ 'api/appuser', formData)
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
  const formData = new FormData();   
  formData.append("id", this.elem.id); 
  formData.append("firstname", ownerFormValue.firstname);
  formData.append("lastname", ownerFormValue.lastname);
  formData.append("username", ownerFormValue.username);
  formData.append("email", ownerFormValue.email);
  
  this.http.put(this.API_URL+ 'api/appuser', formData)
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
