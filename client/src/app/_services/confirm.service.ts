import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Injectable } from '@angular/core';
import { ConfirmDialogComponent } from '../_models/confirm-dialog/confirm-dialog.component';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
 bsModelRef ?:BsModalRef<ConfirmDialogComponent>;
  constructor(private modelService:BsModalService) { }

  confirm(
    title='Confirmation',
    message='Are you sure you want to do this?',
    btnOkText='ok',
    btnCancelText='Cancel'
  ):Observable<boolean>{

    const config:any={
      initialstate:{

        title,
        message,
        btnOkText,
        btnCancelText


      }
    }
    this.bsModelRef = this.modelService.show(ConfirmDialogComponent,config)
     return this.bsModelRef.onHidden!.pipe(
      map(()=>{
        return this.bsModelRef!.content!.result
      })
     )
  }



}
