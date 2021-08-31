import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthService,
        private tokenStorage: TokenStorageService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.tokenStorage.getUser();
        
        if (currentUser) {
            // check if route is restricted by role      
            var curRoles =  currentUser.roles.split(";");    
         
            var index = route.data.roles.includes(curRoles); 

            if (Array.isArray(curRoles)) {
                for (let i = 0; i < curRoles.length; i++) {
    
                  if (route.data.roles.includes(curRoles[i])) {
                    return true;
                  }
                }
            }

            this.router.navigate(['/forbidden']); //TODO: Change to 403 PAGE (403 forbidden)
      return false;

          
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}