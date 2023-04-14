import { ConfirmService } from './../_services/confirm.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { MemberEditComponent } from '../member/member-edit/member-edit.component';

@Injectable({
  providedIn: 'root'
})
export class PreventUnsavedChangesGuard implements CanDeactivate<MemberEditComponent> {

  constructor(private  confirmservice: ConfirmService){}


  canDeactivate(
    component: MemberEditComponent):Observable<boolean>{
    if(component.editForm?.dirty){
      return this.confirmservice.confirm()
    }
    return of(true);
  }

}
