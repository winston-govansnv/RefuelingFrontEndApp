import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  public http: HttpClient;
  public baseUrl: string;
  private API_URL = environment.apiUrl;
  data: any;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.baseUrl = baseUrl;
    this.http = http;
  }

  async getBigChartData() {
    var apiUrl = this.API_URL + 'api/bigchart';
    this.data = await this.http.get(apiUrl).toPromise();
    return this.data;
  }

}
