import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { UserManager } from 'oidc-client';
import { AppUser } from 'src/app/_shared/appuser';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { UserModalComponent } from '../user-modal/user-modal.component';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css']
})
export class ManageUserComponent implements OnInit {
  public ownerForm: FormGroup;
  public http:HttpClient; 
  //public baseUrl:string;
  appUsers: AppUser[];
  breadcrumpPath:any;
  private API_URL= environment.apiUrl;

  displayedColumns: string[] = ['id', 'firstname', 'lastname', 'username', 'email','delete','edit','reset'];
  dataSource;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  
  constructor(public matDialog: MatDialog,http: HttpClient, @Inject('BASE_URL') baseUrl: string,private activatedroute:ActivatedRoute) {
      this.http = http;
      //this.baseUrl = baseUrl; 
   }

  ngOnInit() {
    this.getList();
    this.activatedroute.data.subscribe(data => {
      this.breadcrumpPath=data;
  })
  }

  itemSelected(element){
    this.openModalDriver(element) ;
  }
 
  openModalDriver(element) {
    const dialogRef = this.matDialog.open(UserModalComponent, {
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


  getList(){
    this.http.get<AppUser[]>(this.API_URL + 'api/appuser').subscribe(result => {
        this.appUsers= result;  
        this.dataSource = new MatTableDataSource<AppUser>( this.appUsers);  
        this.dataSource.paginator = this.paginator;       
  }, error => {           
        console.error(error);           
   });
 }

 applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
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

handleResetAlert(element) {
  Swal.fire({
    title: 'Are you sure you want to reset the password?',
    text: 'The password will be reseted!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, reset it!',
    cancelButtonText: 'No, keep it',
  }).then((result) => {
    if (result.isConfirmed) {      
     this.resetPassw(element.id, element.firstname, element.lastname, element.username,element.email);
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
  this.http.delete(this.API_URL + 'api/appuser?id='+ id).subscribe(result => {      
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



resetPassw(id,firstname, lastname, username,email){
  const formData = new FormData();    
  formData.append("id", id);
  formData.append("firstname", firstname);
  formData.append("lastname", lastname);
  formData.append("username", username);
  formData.append("email", email);
  formData.append("reset","true");
  
  this.http.put('/api/appuser', formData)
  .subscribe(res => {
    this.swalWithBootstrapButtons.fire(
      'Reset',
      'The password has been reset.',
      'success'
    )    
  }, () => {
        
  })
}


}
