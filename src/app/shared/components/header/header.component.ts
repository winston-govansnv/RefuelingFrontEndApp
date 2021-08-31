import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public isMenuIconActive: boolean=true;
 

  @Output() toggleSideBarForMe: EventEmitter<any>= new EventEmitter();
  @Output() signOutFormFoMe: EventEmitter<any>= new EventEmitter();

  constructor(private router: Router,private tokenStorageService: TokenStorageService) { }

  ngOnInit() {
    
  }

  toggleSideBar(){    
    this.toggleSideBarForMe.emit();
  }

  signOut(){    
    this.toggleSideBar();
    this.tokenStorageService.signOut();    
    this.isMenuIconActive= false;
    this.router.navigate(['/login']);
    window.location.reload();
  }

}
