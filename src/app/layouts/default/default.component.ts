import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/_services/token-storage.service';


@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit {

  sideBarOpen = true;
  isAuthenticated:boolean= false;

  constructor(private tokenStorage: TokenStorageService) { }

  ngOnInit() {
    var str=   this.tokenStorage.getToken();
    if(str!=null){
      this.isAuthenticated=true;
    }
  }

   sideBarToggler(event){
    this.sideBarOpen = !this.sideBarOpen;
  }

  onActivate(componentReference: any) {
    console.log(" componentReference >> "+ componentReference);   
  }
  
}
