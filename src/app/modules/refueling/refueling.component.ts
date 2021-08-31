import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { VwFuelTruckModel } from 'src/app/_shared/vwfueltruck';
import { VwRefuel } from 'src/app/_shared/vwrefuel';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { RefuelModalComponent } from '../refuel-modal/refuel-modal.component';

@Component({
  selector: 'app-refueling',
  templateUrl: './refueling.component.html',
  styleUrls: ['./refueling.component.css']
})
export class RefuelingComponent implements OnInit {
  myHistForm: FormGroup;
  public ownerForm: FormGroup;
  public http:HttpClient; 
  //public baseUrl:string;
  refuels: VwRefuel[];
  trucks:VwFuelTruckModel[];
  startDate:Date = new Date();
  endDate:Date= new Date();
  breadcrumpPath:any;
  private API_URL= environment.apiUrl;

  displayedColumns: string[] = ['id','updatedAt', 'grossliters','fullname','badgenumber','trucknumber','bolnumber','tankname','edit'];
  dataSource; 
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  
  constructor(private formBuilder: FormBuilder,public matDialog: MatDialog,http: HttpClient, @Inject('BASE_URL') baseUrl: string,private activatedroute:ActivatedRoute) {
      this.http = http;
      //this.baseUrl = baseUrl; 
   }

  ngOnInit() {
    this.myHistForm = this.formBuilder.group({
      picker: ['', Validators.required],
      picker2: ['', Validators.required]
    });   

    this.myHistForm.get('picker').setValue(this.startDate)
    this.myHistForm.get('picker2').setValue(this.startDate)

    this.getRefuels();
    this.activatedroute.data.subscribe(data => {
      this.breadcrumpPath=data;
  })
  }

  itemSelected(element){
    this.openModalDriver(element) ;
  }
 
  openModalDriver(element) {
    const dialogRef = this.matDialog.open(RefuelModalComponent, {
      width: '510px',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: 'custom-dialog-panel-class',
      disableClose: true,
      data: {elem: element}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getRefuels();
    }); 
  }

  

  getRefuels(){

    this.startDate=  this.myHistForm.get('picker').value;
    this.endDate=  this.myHistForm.get('picker2').value;
    this.http.get<VwRefuel[]>(this.API_URL + 'api/refuel?start='+this.startDate.toDateString()+'&&end='+ this.endDate.toDateString() ).subscribe(result => {
        this.refuels= result;  
        this.dataSource = new MatTableDataSource<VwRefuel>( this.refuels);  
        this.dataSource.paginator = this.paginator;      
  }, error => {           
        console.error(error);             
   });
 }

 getTrucks(){
  this.http.get<VwFuelTruckModel[]>(this.API_URL + 'api/fueltruck').subscribe(result => {
      this.trucks= result;      
}, error => {           
      console.error(error);           
 });
}

 applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}


 swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})


}
