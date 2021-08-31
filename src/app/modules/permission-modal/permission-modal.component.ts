import { HttpClient } from '@angular/common/http';
import { Optional } from '@angular/core';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppRole } from 'src/app/_shared/approle';
import { VwAppPermission } from 'src/app/_shared/vwapppermission';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-permission-modal',
  templateUrl: './permission-modal.component.html',
  styleUrls: ['./permission-modal.component.css']
})
export class PermissionModalComponent implements OnInit {
  public ownerForm: FormGroup;
  public http:HttpClient; 
  //public baseUrl:string;
  roles:AppRole[];
  permissions: VwAppPermission[];
  private API_URL= environment.apiUrl;
  elem:any;

  actions = [
    { id: 1, name: "Yes" },
    { id: 0, name: "No" }
  ];

  constructor(public dialogRef: MatDialogRef<PermissionModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,http: HttpClient, @Inject('BASE_URL') baseUrl: string,private fb: FormBuilder) { 
      this.elem = data.elem;   
      this.http = http;
      //this.baseUrl = baseUrl;     
  }

  ngOnInit() { 
    this.ownerForm = this.fb.group({
      rolename: new FormControl('', [Validators.required]),   
      actionname: new FormControl('', [Validators.required, Validators.maxLength(20)]),   
      cancreate: new FormControl('', [Validators.required]),   
      canupdate: new FormControl('', [Validators.required]), 
      candelete: new FormControl('', [Validators.required]), 
    });

    this.getRolenames();

    if(this.elem!=null){
      this.ownerForm.get('rolename').setValue(this.elem.fk_roleId),
      this.ownerForm.get('actionname').setValue(this.elem.actionName),
      this.ownerForm.get('cancreate').setValue(this.elem.canCreate)
      this.ownerForm.get('canupdate').setValue(this.elem.canUpdate)
      this.ownerForm.get('candelete').setValue(this.elem.canDelete)
    }
  }
  public hasError = (controlName: string, errorName: string) =>{
    return this.ownerForm.controls[controlName].hasError(errorName);
  }
  public onCancel = () => {
    this.dialogRef.close({ event: 'close'});    
  }

  getRolenames(){ 
    this.http.get<AppRole[]>(this.API_URL + 'api/approle').subscribe(result => {
        this.roles= result;  
  }, error => {           
        console.error(error);           
   });
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
    this.http.post(this.API_URL+'api/apppermission', formData)
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
  
  this.http.put(this.API_URL+'api/apppermission', formData)
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
