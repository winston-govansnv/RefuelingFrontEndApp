import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { FuelTypeModel } from 'src/app/_shared/fueltypemodel';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { FueltypeModalComponent } from '../fueltype-modal/fueltype-modal.component';

@Component({
  selector: 'app-manage-fueltype',
  templateUrl: './manage-fueltype.component.html',
  styleUrls: ['./manage-fueltype.component.css']
})
export class ManageFueltypeComponent implements OnInit {
  public ownerForm: FormGroup;
  public http:HttpClient; 
  //public baseUrl:string;
  fuelTypes: FuelTypeModel[];
  breadcrumpPath:any;
  private API_URL= environment.apiUrl;

  displayedColumns: string[] = ['id', 'fuelTypeName','delete','edit'];
  dataSource;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  
  constructor(public matDialog: MatDialog,http: HttpClient, @Inject('BASE_URL') baseUrl: string,private activatedroute:ActivatedRoute) {
      this.http = http;
      //this.baseUrl = baseUrl; 
   }

  ngOnInit() {
    this.getFuelTypes();
    this.activatedroute.data.subscribe(data => {
      this.breadcrumpPath=data;
  })
  }

  itemSelected(element){
    this.openModalDriver(element) ;
  }
 
  openModalDriver(element) {
    const dialogRef = this.matDialog.open(FueltypeModalComponent, {
      height:"240px",
      width: '400px',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: 'custom-dialog-panel-class',
      disableClose: true,
      data: {elem: element}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getFuelTypes();
    });
  }

  

  getFuelTypes(){
    this.http.get<FuelTypeModel[]>(this.API_URL + 'api/fueltype').subscribe(result => {
        this.fuelTypes= result;  
        this.dataSource = new MatTableDataSource<FuelTypeModel>( this.fuelTypes);  
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

removeDriver(id){
  this.http.delete(this.API_URL + 'api/fueltype?id='+ id).subscribe(result => {      
    this.getFuelTypes();  
    this.swalWithBootstrapButtons.fire(
      'Deleted',
      'The fuel type record has been deleted.',
      'success'
    )       
}, error => {           
      console.error(error);  
      this.swalWithBootstrapButtons.fire(
        'Cancelled',
        'The fuel type record cannot be removed.',
        'error'
      )         
 });
}
}
