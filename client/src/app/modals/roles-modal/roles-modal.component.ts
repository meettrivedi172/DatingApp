import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-roles-modal',
  templateUrl: './roles-modal.component.html',
  styleUrls: ['./roles-modal.component.css']
})
export class RolesModalComponent implements OnInit{

 user:User  | any;
  username='';
availableRoles:any[] =[];
selectedRoles:any[] =[];



constructor(public bsModalRef:BsModalRef,private adminservice:AdminService){}
ngOnInit(): void {

}


  updatechecked(checkedValue:string){

    const index = this.selectedRoles.indexOf(checkedValue);
   index !== -1 ? this.selectedRoles.splice(index,1) : this.selectedRoles.push(checkedValue);


  }



  updateAdmin(){

    const  selecetedRoles:any= this.bsModalRef.content?.selectedRoles;

    if(!this.arrayEqual(selecetedRoles!,this.user.roles)){
      this.adminservice.updateUserRoles(this.user.username,selecetedRoles ).subscribe({
        next:roles=>{

          this.user.roles = roles;
          this.bsModalRef.hide();
        }

      })
    }}


    private arrayEqual(arr1:any[],arr2:any[]){
      return JSON.stringify(arr1.sort()) ===JSON.stringify(arr2.sort())
  }

}
