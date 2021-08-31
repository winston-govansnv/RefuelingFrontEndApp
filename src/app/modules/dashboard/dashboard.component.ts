import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ChartData } from 'chart.js';
import { FuelCardModel } from 'src/app/_shared/fuelcardmodel';
import { environment } from 'src/environments/environment';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  updateFlag:boolean=false;
  bigChart=[];
  breadcrumpPath:any;
  public http:HttpClient; 
 // public baseUrl:string;
  fuelcards:FuelCardModel[];
  unleadedPremiumTotal: string="0K";
  dieselotal: string="0K";
  keroseneTotal: string="0K";
  info95ConTotal:string="0K";
  lsdnrlmTotal: string="0K";
  private API_URL= environment.apiUrl;

  unleadedPremiumPerc: string;
  dieselPerc: string;
  kerosenePerc: string;
  info95ConPerc: string;
  lsdnrlmPerc:string;
  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(private dashboardService: DashboardService,private activatedroute:ActivatedRoute,http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
   //   this.baseUrl = baseUrl; 
   }

  async ngOnInit() {
    this.activatedroute.data.subscribe(data => {
      this.breadcrumpPath=data;
    });

    this.bigChart = await this.dashboardService.getBigChartData();
    this.updateFlag= true;     
    this.getFuelCards();
  }

  getFuelCards(){
    this.http.get<FuelCardModel[]>(this.API_URL + 'api/fuelcard').subscribe(result => {
        this.fuelcards= result;  

        if (Array.isArray(result)) {
          for (let i = 0; i < result.length; i++) {

            if (result[i].label==='Unleaded Premium') {
             this.unleadedPremiumTotal = (result[i].data[1]/1000).toFixed(0) + "K"; 

             if(result[i].data[1]<result[i].data[0]){
                this.unleadedPremiumPerc= ((1-(result[i].data[1]/result[i].data[0])) * 100).toFixed(0) + "%"; 
              }else{
                this.unleadedPremiumPerc= (result[i].data[0]/result[i].data[1] * 100).toFixed(0)+ "%";  
              } 
            }

            if (result[i].label==='Diesel Oil') {
              this.dieselotal = (result[i].data[1]/1000).toFixed(0) + "K";

              if(result[i].data[1]<result[i].data[0]){
                this.dieselPerc= (result[i].data[1]/result[i].data[0] * 100).toFixed(0); 
              }else{
                this.dieselPerc= (result[i].data[0]/result[i].data[1] * 100).toFixed(0) + "%"; 
              }              
            }

            if (result[i].label==='Kerosene') {
              this.keroseneTotal = (result[i].data[1]/1000).toFixed(0) + "K";

              if(result[i].data[1]<result[i].data[0]){
                this.kerosenePerc= (result[i].data[1]/result[i].data[0] * 100).toFixed(0) + "%"; 
              }else{
                this.kerosenePerc= (result[i].data[0]/result[i].data[1] * 100).toFixed(0) + "%"; 
              }       
            }

            if (result[i].label==='95-COM') {
              this.info95ConTotal = (result[i].data[1]/1000).toFixed(0) + "K";

              if(result[i].data[1]<result[i].data[0]){
                this.info95ConPerc= (result[i].data[1]/result[i].data[0] * 100).toFixed(0) + "%"; 
              }else{
                this.info95ConPerc= (result[i].data[0]/result[i].data[1] * 100).toFixed(0) + "%"; 
              }       
            }

            if (result[i].label==='LSD-NRLM') {
              this.lsdnrlmTotal = (result[i].data[1]/1000).toFixed(0) + "K";

              if(result[i].data[1]<result[i].data[0]){
                this.lsdnrlmPerc= (result[i].data[1]/result[i].data[0] * 100).toFixed(0) + "%"; 
              }else{
                this.lsdnrlmPerc= (result[i].data[0]/result[i].data[1] * 100).toFixed(0) + "%"; 
              }       
            }
          }
      }  
  }, error => {           
        console.error(error);           
   });
 }

}


