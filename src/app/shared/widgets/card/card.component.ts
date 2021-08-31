import { HttpClient } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { ChartData } from 'chart.js';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-widget-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input() label: string;
  @Input() total: string;
  @Input() percentage: string;

  public http:HttpClient; 
 // public baseUrl:string;
  private API_URL= environment.apiUrl;
  trendingUp: boolean;
  public chartdata: ChartData;
  monthName: string[]=['Jan','Feb','Mar','Apr','May','Jun',
                       'Jul','Aug','Sep','Oct','Nov','Dec' ]

  title = '';

  // ADD CHART OPTIONS. 
  chartOptions = {
    scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: ''
          }
        }]
      }     ,
    responsive: true    // THIS WILL MAKE THE CHART RESPONSIVE (VISIBLE IN ANY DEVICE).
  }


  options = {
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'probability'
        }
      }]
    }     
  }

  labels =  [];

  // STATIC DATA FOR THE CHART IN JSON FORMAT.
  chartData = [];

  // CHART COLOR.
  colors = [];
   

  constructor(http: HttpClient,  @Inject('BASE_URL') baseUrl: string) { 
   // this.baseUrl=baseUrl;
    this.http= http; 
   
  }


  search(){
    var fuelTypeId =0;
    if(this.label==="Unl. Premium"){
      fuelTypeId=1
      this.colors = [
        { 
          backgroundColor: 'rgba(204,0,0,0.8)'
        }
      ]
    }
     

    if(this.label==="Diesel"){
      fuelTypeId=2
      this.colors = [
        { 
          backgroundColor: 'rgba(255, 128, 0, 0.8)'
        }
      ]
    }
    

    if(this.label==="Kerosene"){
      fuelTypeId=3;

      this.colors = [
        { 
          backgroundColor: 'rgba(0, 102, 204, 0.8)'
        }
      ]
    }
    

    if(this.label==="95-COM"){
      fuelTypeId=4;

      this.colors = [
        { 
          backgroundColor: 'rgba(0, 204, 204, 0.8)'
        }
      ]
    }
    

    if(this.label==="LSD-NRLM"){
      fuelTypeId=5;
      this.colors = [
        { 
          backgroundColor: 'rgba(0, 204, 102, 0.8)'
        }
      ]      
    }
        

    this.http.get<ChartData>(this.API_URL + 'api/fuelcard?fuelType='+ fuelTypeId).subscribe(result => {
        this.chartData = result as [];
        if(result[0].data[1]> result[0].data[0])
          this.trendingUp= true;
    }, error => { 
        console.error(error)             
    });
  }

  ngOnInit(): void {
    this.search();

    //Build the label data
    //var str= 'Oct 2020', 'Nov 2020';
    var year = new Date().getFullYear();
    var strMonthCur = this.monthName[new Date().getMonth()];
    var strMonthPrev = this.monthName[new Date().getMonth()-1];

    this.labels[0]=strMonthPrev +' '+ year;
    this.labels[1]=strMonthCur +' '+ year;
  }

}
