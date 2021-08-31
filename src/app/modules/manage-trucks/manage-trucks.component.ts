import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { FuelTruckModel } from 'src/app/_shared/fueltruckmodel';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { TruckModalComponent } from '../truck-modal/truck-modal.component';

@Component({
  selector: 'app-manage-trucks',
  templateUrl: './manage-trucks.component.html',
  styleUrls: ['./manage-trucks.component.css']
})
export class ManageTrucksComponent implements OnInit {
  public ownerForm: FormGroup;
  public http:HttpClient; 
  //public baseUrl:string;
  drivers: FuelTruckModel[];
  breadcrumpPath:any;
  private API_URL= environment.apiUrl;

  displayedColumns: string[] = ['id', 'truckNumber', 'fuelCapacity', 'totalizerId', 'departmentName','delete','edit'];
  dataSource;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  
  constructor(public matDialog: MatDialog,http: HttpClient, @Inject('BASE_URL') baseUrl: string,private activatedroute:ActivatedRoute) {
      this.http = http;
      //this.baseUrl = baseUrl; 
   }

  ngOnInit() {
    this.getTrucks();
    this.activatedroute.data.subscribe(data => {
      this.breadcrumpPath=data;
  })
  }

  itemSelected(element){
    this.openModalDriver(element) ;
  }
 
  openModalDriver(element) {
    const dialogRef = this.matDialog.open(TruckModalComponent, {
      height:"340px",
      width: '550px',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: 'custom-dialog-panel-class',
      disableClose: true,
      data: {elem: element}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getTrucks();
    });
  }

  

  getTrucks(){
    this.http.get<FuelTruckModel[]>(this.API_URL + 'api/fueltruck').subscribe(result => {
        this.drivers= result;  
        this.dataSource = new MatTableDataSource<FuelTruckModel>( this.drivers);  
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
  this.http.delete(this.API_URL + 'api/fueltruck?id='+ id).subscribe(result => {      
    this.getTrucks();  
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
