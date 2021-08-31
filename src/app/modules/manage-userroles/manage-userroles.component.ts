import { HttpClient } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { AppRole } from 'src/app/_shared/approle';
import { AppUser } from 'src/app/_shared/appuser';
import { AppUserRole } from 'src/app/_shared/appuserrole';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-userroles',
  templateUrl: './manage-userroles.component.html',
  styleUrls: ['./manage-userroles.component.css']
})
export class ManageUserrolesComponent implements OnInit {
  public ownerForm: FormGroup;
  public http:HttpClient; 
  //public baseUrl:string;
  appUserRoles: AppUserRole[];
  roles: AppRole[];
  appUsers: AppUser[];
  private API_URL= environment.apiUrl;
  breadcrumpPath:any;

  displayedColumns: string[] = ['id', 'fullname', 'rolename', 'delete'];
  dataSource;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  
  constructor(public matDialog: MatDialog,http: HttpClient, @Inject('BASE_URL') baseUrl: string,private activatedroute:ActivatedRoute,private fb: FormBuilder) {
      this.http = http;
      //this.baseUrl = baseUrl; 
   }

  ngOnInit() {
    this.ownerForm = this.fb.group({
      role: new FormControl('', [Validators.required, Validators.maxLength(20)]),  
      appuser: new FormControl('', [Validators.required, Validators.maxLength(50)]),  
    });

    this.getList();
    this.getRolenames();
    this.getAppusers();

    this.activatedroute.data.subscribe(data => {
      this.breadcrumpPath=data;
    })
  }

  getList(){
    this.http.get<AppUserRole[]>(this.API_URL + 'api/appuserrole').subscribe(result => {
        this.appUserRoles= result;  
        this.dataSource = new MatTableDataSource<AppUserRole>( this.appUserRoles);  
        this.dataSource.paginator = this.paginator;       
  }, error => {           
        console.error(error);           
   });
 }

 getRolenames(){
  this.http.get<AppRole[]>(this.API_URL + 'api/approle').subscribe(result => {
      this.roles= result;  
}, error => {           
      console.error(error);           
 });
}

getAppusers(){
  this.http.get<AppUser[]>(this.API_URL + 'api/appuser').subscribe(result => {
      this.appUsers= result;  
}, error => {           
      console.error(error);           
 });
}

 applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

public hasError = (controlName: string, errorName: string) =>{
  return this.ownerForm.controls[controlName].hasError(errorName);
}

assignRole(ownerFormValue: any){

  if (this.ownerForm.invalid) {
    return;
}

    const formData = new FormData();    
    formData.append("fk_appuserId", ownerFormValue.appuser);
    formData.append("fk_roleId", ownerFormValue.role);

    this.http.post('/api/appuserrole', formData)
    .subscribe(res => {
      this.getList();
      this.ownerForm.reset();
      this.swalWithBootstrapButtons.fire(
        'Created',
        'The record has been created.',
        'success'
      )           
    }, () => {
          
    })

}


 // Custom Buttons
 handleWarningAlert(element) {
  Swal.fire({
    title: 'Are you sure?',
    text: 'You will not be able to recover this action!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, keep it',
  }).then((result) => {
    if (result.isConfirmed) {      
     this.removeObject(element.id);
    } else if (result.isDismissed) {
      console.log('Clicked No, record is safe!');
    }
  })
}

swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})

removeObject(id){
  this.http.delete(this.API_URL + 'api/appuserrole?id='+ id).subscribe(result => {      
    this.getList();  
    this.swalWithBootstrapButtons.fire(
      'Deleted',
      'The record has been deleted.',
      'success'
    )       
}, error => {           
      console.error(error);  
      this.swalWithBootstrapButtons.fire(
        'Cancelled',
        'The record cannot be removed.',
        'error'
      )         
 });
}



}
