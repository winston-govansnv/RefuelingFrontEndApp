import { Optional } from '@angular/core';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RefuleingHistory } from 'src/app/_shared/refuelinghistory';

@Component({
  selector: 'app-delivery-modal',
  templateUrl: './delivery-modal.component.html',
  styleUrls: ['./delivery-modal.component.css']
})
export class DeliveryModalComponent implements OnInit {
  elem:any;
  truck: string="";

  constructor( public dialogRef: MatDialogRef<DeliveryModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.elem = data.elem;      
  }

  ngOnInit(): void {
    this.truck = this.elem.truck;
  }

  closeModal() {
    this.dialogRef.close({ event: 'close'});
  }

}
