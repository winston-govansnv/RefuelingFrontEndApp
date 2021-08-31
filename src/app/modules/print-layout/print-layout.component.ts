import { Component, OnInit, ViewChild } from '@angular/core';
import { DriverScheduleComponent } from '../driver-schedule/driver-schedule.component';

@Component({
  selector: 'app-print-layout',
  templateUrl: './print-layout.component.html',
  styleUrls: ['./print-layout.component.css']
})
export class PrintLayoutComponent implements OnInit {
  @ViewChild('child') child:DriverScheduleComponent;
  constructor() { }

  ngOnInit(): void {
  }

}
