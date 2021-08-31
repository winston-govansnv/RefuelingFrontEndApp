import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { DriverModel } from 'src/app/_shared/drivermodel';
import { VWDepartment } from 'src/app/_shared/vwdepartment';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { DepartmentModalComponent } from '../department-modal/department-modal.component';
import { DriverModalComponent } from '../driver-modal/driver-modal.component';

@Component({
  selector: 'app-manage-department',
  templateUrl: './manage-department.component.html',
  styleUrls: ['./manage-department.component.css']
})
export class ManageDepartmentComponent implements OnInit {

  public ownerForm: FormGroup;
  public http:HttpClient;
  //public baseUrl:string;
  departments: VWDepartment[];
  breadcrumpPath:any;
  private API_URL= environment.apiUrl;

  displayedColumns: string[] = ['id', 'departmentname', 'address1', 'address2', 'postalcode', 'city', 'phone','delete','edit'];
  dataSource;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(public matDialog: MatDialog,http: HttpClient, @Inject('BASE_URL') baseUrl: string,private activatedroute:ActivatedRoute) {
      this.http = http;
      //this.baseUrl = baseUrl;
   }

  ngOnInit() {
    this.getDrivers();
    this.activatedroute.data.subscribe(data => {
      this.breadcrumpPath=data;
  })
  }

  itemSelected(element){
    this.openModal(element) ;
  }

  openModal(element) {
    const dialogRef = this.matDialog.open(DepartmentModalComponent, {
      width: '550px',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: 'custom-dialog-panel-class',
      disableClose: true,
      data: {elem: element}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getDrivers();
    });
  }

  getDrivers(){
        this.http.get<VWDepartment[]>(this.API_URL + 'api/department').subscribe(result => {
        this.departments= result;
        this.dataSource = new MatTableDataSource<VWDepartment>( this.departments);
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
     this.removeDriver(element.id);
    } else if (result.isDismissed) {
      console.log('Clicked No, driver is safe!');
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

removeDriver(id){
  this.http.delete(this.API_URL + 'api/department?id='+ id).subscribe(result => {
    this.getDrivers();
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
