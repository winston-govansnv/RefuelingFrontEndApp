import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { VwFuelPrice } from 'src/app/_shared/vwfuelprice';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { FuelpriceModalComponent } from '../fuelprice-modal/fuelprice-modal.component';

@Component({
  selector: 'app-manage-fuelprice',
  templateUrl: './manage-fuelprice.component.html',
  styleUrls: ['./manage-fuelprice.component.css']
})
export class ManageFuelpriceComponent implements OnInit {
  public ownerForm: FormGroup;
  public http:HttpClient; 
  //public baseUrl:string;
  fuelTypes: VwFuelPrice[];
  private API_URL= environment.apiUrl;
  breadcrumpPath:any;

  displayedColumns: string[] = ['id', 'fuelTypeName','fuelPriceInAWG','validFrom','validUntil','history','edit'];
  dataSource;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  
  constructor(public matDialog: MatDialog,http: HttpClient, @Inject('BASE_URL') baseUrl: string,private activatedroute:ActivatedRoute) {
      this.http = http;
      //this.baseUrl = baseUrl; 
   }

  ngOnInit() {
    this.getObjects();
    this.activatedroute.data.subscribe(data => {
      this.breadcrumpPath=data;
  })
  }

  itemSelected(element){
    this.openModalDriver(element) ;
  }
 
  openModalDriver(element) {
    const dialogRef = this.matDialog.open(FuelpriceModalComponent, {
      height:"255px",
      width: '500px',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: 'custom-dialog-panel-class',
      disableClose: true,
      data: {elem: element}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getObjects();
    });
  }

  

  getObjects(){
    this.http.get<VwFuelPrice[]>(this.API_URL + 'api/fuelprice').subscribe(result => {
        this.fuelTypes= result;  
        this.dataSource = new MatTableDataSource<VwFuelPrice>( this.fuelTypes);  
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
 swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})

removeObject(id){
  this.http.delete(this.API_URL + 'api/fueltype?id='+ id).subscribe(result => {      
    this.getObjects();  
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
