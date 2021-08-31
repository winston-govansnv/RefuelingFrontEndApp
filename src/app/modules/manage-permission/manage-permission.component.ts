import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { AppRole } from 'src/app/_shared/approle';
import { AppUser } from 'src/app/_shared/appuser';
import { AppUserRole } from 'src/app/_shared/appuserrole';
import { VwAppPermission } from 'src/app/_shared/vwapppermission';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { PermissionModalComponent } from '../permission-modal/permission-modal.component';

@Component({
  selector: 'app-manage-permission',
  templateUrl: './manage-permission.component.html',
  styleUrls: ['./manage-permission.component.css']
})
export class ManagePermissionComponent implements OnInit {
  public ownerForm: FormGroup;
  public http:HttpClient; 
  //public baseUrl:string;
  appPermissions: VwAppPermission[];
  roles:AppRole[];
  private API_URL= environment.apiUrl;
  breadcrumpPath:any;

  displayedColumns: string[] = ['id', 'rolename', 'actionname', 'cancreate','canupdate','candelete','delete','edit'];
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
  
    this.activatedroute.data.subscribe(data => {
      this.breadcrumpPath=data;
    })
  }

  getList(){
    this.http.get<[VwAppPermission]>(this.API_URL + 'api/apppermission').subscribe(result => {
        this.appPermissions= result;  
        this.dataSource = new MatTableDataSource<VwAppPermission>( this.appPermissions);  
        this.dataSource.paginator = this.paginator;       
  }, error => {           
        console.error(error);           
   });
 }


 selectRole(ownerFormValue: any){
  this.http.get<[VwAppPermission]>(this.API_URL + 'api/apppermission?roleId='+ownerFormValue.role).subscribe(result => {
    this.appPermissions= result;  
    this.dataSource = new MatTableDataSource<VwAppPermission>( this.appPermissions);  
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

 applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

public hasError = (controlName: string, errorName: string) =>{
  return this.ownerForm.controls[controlName].hasError(errorName);
}

openModal(element) {
  const dialogRef = this.matDialog.open(PermissionModalComponent, {
    width: '550px',
    backdropClass: 'custom-dialog-backdrop-class',
    panelClass: 'custom-dialog-panel-class',
    disableClose: true,
    data: {elem: element}
  });

  dialogRef.afterClosed().subscribe(result => {
    this.getList();
  });
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
  this.http.delete(this.API_URL + 'api/apppermission?id='+ id).subscribe(result => {      
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
