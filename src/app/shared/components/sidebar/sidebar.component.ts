import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { VwAppPermission } from 'src/app/_shared/vwapppermission';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  tokenFound:boolean=false;
  sideBarList: VwAppPermission[]=[]
  sideBarAdminList: VwAppPermission[]=[]
  sideBarReportList: VwAppPermission[]=[]
  public http:HttpClient; 
 // public baseUrl:string;
  adminActive:boolean=false;
  private API_URL= environment.apiUrl;

role: any;
  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string,private tokenStorageService: TokenStorageService) { 
    this.http = http;
  //  this.baseUrl = baseUrl;    
  }

  ngOnInit() {
    this.role = this.tokenStorageService.getUser().roles;
    var curRoles = this.role.split(";");  
    
    if (Array.isArray(curRoles)) {
        for (let i = curRoles.length; i >= 0; i--) {      
          this.getSideBarList(curRoles[i]);
        }
    }   
  }

  getSideBarList(roleName: string){    
    this.http.get<VwAppPermission[]>(this.API_URL + 'api/apppermission?roleName='+ roleName).subscribe(result => {    
        
    if (Array.isArray(result)) {
        for (let i = 0; i < result.length; i++) {
          if(result[i].isAdmin===1){ 
            this.sideBarAdminList.push(result[i]);             
          }
        
          if(roleName==='supervisor' && result[i].isAdmin===0 && result[i].isReport===0 ){             
            this.sideBarList.push(result[i]);
          }

          if(roleName==='supervisor' && result[i].isReport===1){             
            this.sideBarReportList.push(result[i]);
          }
        }
    }       
  }, error => {           
        console.error(error);           
   });
 }
}
