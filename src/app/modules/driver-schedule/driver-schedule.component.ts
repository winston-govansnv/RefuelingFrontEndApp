import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as printJS from 'print-js';
import { DeliveryReportPrint } from 'src/app/_shared/delivery-report-print';
import { DriverReportPrint } from 'src/app/_shared/driver-report-print';
import { DriverModel } from 'src/app/_shared/drivermodel';
import { RefuleingHistory } from 'src/app/_shared/refuelinghistory';
import { VwDriverSchedule } from 'src/app/_shared/vwdriverschedule';
import { environment } from 'src/environments/environment';
import { DriverModalComponent } from '../driver-modal/driver-modal.component';

@Component({
  selector: 'app-driver-schedule',
  templateUrl: './driver-schedule.component.html',
  styleUrls: ['./driver-schedule.component.css']
})
export class DriverScheduleComponent implements OnInit {


  myHistForm: FormGroup;
  public http: HttpClient;
  //public baseUrl:string;
  public history: VwDriverSchedule[];
  startDate: Date = new Date();
  endDate: Date = new Date();
  drivers: DriverModel[];
  dataSource: any;
  isValid: boolean = true;
  showLoading: boolean = false;
  noDataFound: boolean = true;
  breadcrumpPath: any;
  private API_URL = environment.apiUrl;

  displayedColumns: string[] = ['id', 'deliveryDate', 'badgeNumber', 'driver', 'customer', 'truck', 'fuelType', 'fuelLiters', 'est-starttime', 'est-endtime'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string
    , private formBuilder: FormBuilder, public matDialog: MatDialog, private activatedroute: ActivatedRoute, private router: Router, private datePipe: DatePipe) {
    this.http = http;
    // this.baseUrl = baseUrl;
  }
  ngAfterViewInit(): void {
    // this.search();
  }

  ngOnInit() {
    this.myHistForm = this.formBuilder.group({
      drivers: ['', Validators.required],
      picker: ['', Validators.required],
      picker2: ['', Validators.required]
    });

    this.myHistForm.get('picker').setValue(this.startDate)
    this.myHistForm.get('picker2').setValue(this.startDate)

    this.activatedroute.data.subscribe(data => {
      this.breadcrumpPath = data;
    });

    this.getDrivers();
  }


  search() {
    // stop here if form is invalid
    if (this.myHistForm.invalid) {
      this.isValid = false;
      return;
    }

    this.startDate = this.myHistForm.get('picker').value;
    this.endDate = this.myHistForm.get('picker2').value;
    var driverId = this.myHistForm.get('drivers').value;
    this.showLoading = true;
    this.noDataFound = false;

    this.http.get<VwDriverSchedule[]>(this.API_URL + 'api/driverschedule?start=' + this.startDate.toDateString() + '&&end=' + this.endDate.toDateString() + '&&driverId=' + driverId).subscribe(result => {
      this.showLoading = false;
      this.isValid = true;
      this.history = result;
      this.dataSource = new MatTableDataSource<VwDriverSchedule>(this.history);
      if (result != null)
        this.dataSource.paginator = this.paginator;

      if (result == null)
        this.noDataFound = true;

      if (result != null && result.length == 0)
        this.noDataFound = true;

    }, error => {
      this.showLoading = false;
      console.error(error)
    });
  }

  getDrivers() {
    this.http.get<DriverModel[]>(this.API_URL + 'api/driver').subscribe(result => {
      this.drivers = result;
    }, error => {
      console.error(error);
    });
  }

  clear() {
    this.myHistForm.reset();
    this.history = null;
    this.noDataFound = true;
    this.dataSource = null;
    this.isValid = true;
  }

  print() {
    var report: DriverReportPrint[] = [];

    if (Array.isArray(this.history)) {
      for (let i = 0; i < this.history.length; i++) {
        var item: DriverReportPrint = new DriverReportPrint();
        var r: VwDriverSchedule = this.history[i];
        item.no = i + 1;
        item.customer = r.clientName;
        var deliveryDateMedium = this.datePipe.transform(r.deliveryDate, "dd-MM-yyyy");
        item.deliveryDate = deliveryDateMedium;
        var mediumStart = this.datePipe.transform(r.estimatedDeliveryStartTime, "h:mm a");
        item.startTime = mediumStart;
        item.fueltype = r.fuelType;
        item.liters = r.toDeliveryVolume;
        item.driver = r.driver;
        item.truck = r.truckNumber;
        report.push(item);
      }
    }

    printJS({ printable: report, properties: ['no', 'deliveryDate', 'driver', 'truck', 'customer', 'startTime', 'fueltype', 'liters'], type: 'json', header: 'Driver Schedule Report' });
  }


}
