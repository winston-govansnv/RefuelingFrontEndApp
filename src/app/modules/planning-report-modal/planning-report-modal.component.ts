import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as jspdf from 'jspdf';  
import html2canvas from 'html2canvas';  
import * as jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-planning-report-modal',
  templateUrl: './planning-report-modal.component.html',
  styleUrls: ['./planning-report-modal.component.css']
})
export class PlanningReportModalComponent implements OnInit {

  @ViewChild('content', { static: true }) content: ElementRef;
  constructor() { }

  ngOnInit(): void {   
  }

  public captureScreen()  
  {     
    var doc = new jspdf.jsPDF()

    // Simple data example
    var head = [['ID', 'Country', 'Rank', 'Capital']]
    var body = [
      [1, 'Denmark', 7.526, 'Copenhagen'],
      [2, 'Switzerland', 7.509, 'Bern'],
      [3, 'Iceland', 7.501, 'Reykjavík'],
    ]
    autoTable(doc, {
      head: head,
      body: body,
      didDrawPage: (dataArg) => { 
       doc.text('PAGE', dataArg.settings.margin.left, 10);
      }
    }); 

    doc.save('table.pdf');
  }  
  
}
