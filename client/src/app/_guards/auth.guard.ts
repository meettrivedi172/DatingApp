import { AccountService } from './../_services/account.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private accountservice:AccountService,private tost:ToastrService){


  }

  canActivate(): Observable<boolean>  {
    return this.accountservice.currentUser$.pipe(map(user =>{
      if(user)return true;
      else{
        this.tost.error("you will not pass!")
        return false
      }
    }))
  }

}
