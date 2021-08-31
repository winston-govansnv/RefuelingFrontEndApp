import { HttpClient } from '@angular/common/http';
import {  Component,  Inject,  OnInit} from '@angular/core';
import { ChartData, ChartDataSets } from 'chart.js';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-widget-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css']
})
export class AreaComponent implements OnInit {
  public chartdata: ChartData;
  title: string='Fuel Delivery Report';
  monthName: string[]=['January','February','March','April','May','June',
                       'July','August','September','October','November','December' ]
  
  public http:HttpClient; 
  //public baseUrl:string;
  private API_URL= environment.apiUrl;

  // ADD CHART OPTIONS. 
  chartOptions = {
    title: {
      display: true,
      text: 'Fuel Delivery Report ('+ this.monthName[new Date().getMonth()] +  ' '+ new Date().getFullYear() + ')'
      
  },
    scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Revenue (AWG)'
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
  colors = [  
    { 
      backgroundColor: 'rgba(153,204,255,0.9)',
    },
    {  
      backgroundColor: 'rgba(153,255,204,0.9)',

    }
  ]

  constructor(http: HttpClient,  @Inject('BASE_URL') baseUrl: string) { 
   //this.baseUrl=baseUrl;
    this.http= http; 
  }


  daysRemainingInMonth() {
    let dateTime = new Date()
    var year = dateTime.getFullYear();
    var month = dateTime.getMonth()
    return new Date(year, month+1, 0).getDate()
 }

 createRange(number){
  var items: string[] = [];
  for(var i = 1; i <= number; i++){
     items.push(""+i);
  }
  return items;
}
 
  search(){
    this.http.get<ChartData>(this.API_URL + 'api/bigchart').subscribe(result => {
      this.chartData = result as [];
  }, error => {
      console.error(error)             
  });
 }
  
 
  ngOnInit(): void {
    this.search();

    //build the labels
    var count: number= this.daysRemainingInMonth();
    this.labels = this.createRange(count);
  }

  

}
