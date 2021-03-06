import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminAccessGuard implements CanActivate {

  constructor(private router:Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      /* if(localStorage.getItem("username")=="admin"){
        return true;
      }else{
        this.router.navigate(['/userDashboard'])
      } */

      if(localStorage.getItem("isAdmin")=="true"){
        return true;
      }else{
        this.router.navigate(['/userDashboard'])
      }
  }
  
}
