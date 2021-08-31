import { HttpClient } from '@angular/common/http';
import { Optional } from '@angular/core';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-role-modal',
  templateUrl: './role-modal.component.html',
  styleUrls: ['./role-modal.component.css']
})
export class RoleModalComponent implements OnInit {

  public ownerForm: FormGroup;
  public http:HttpClient; 
  //public baseUrl:string;
  private API_URL= environment.apiUrl;
  elem:any;

  constructor(public dialogRef: MatDialogRef<RoleModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,http: HttpClient, @Inject('BASE_URL') baseUrl: string,private fb: FormBuilder) { 
      this.elem = data.elem;   
      this.http = http;
      //this.baseUrl = baseUrl;     
  }

  ngOnInit() { 
    this.ownerForm = this.fb.group({
      rolename: new FormControl('', [Validators.required, Validators.maxLength(20)]),   
    });

    if(this.elem!=null){
      this.ownerForm.get('rolename').setValue(this.elem.rolename)
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
    formData.append("rolename", ownerFormValue.rolename);

    this.http.post(this.API_URL+'api/approle', formData)
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
  formData.append("rolename", ownerFormValue.rolename);
  
  this.http.put(this.API_URL+ 'api/approle', formData)
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
