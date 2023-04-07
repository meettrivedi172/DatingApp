import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';
import { RolesModalComponent } from 'src/app/modals/roles-modal/roles-modal.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit{
users:User[]=[];
bsModelref:BsModalRef<RolesModalComponent> = new BsModalRef<RolesModalComponent>();
availableRoles =['Admin','Moderator','Member']

constructor(private adminservice:AdminService,private modalservice:BsModalService){}


  ngOnInit(): void {

    this.getUsersWithRoles()

  }


getUsersWithRoles(){
    this.adminservice.getUserWithRoles().subscribe({
      next: users=>{
        this.users = users
       console.log(users);
      }
    })
}

openRolesModel(user:User){

 const config ={
  class: "model-dialog-centered",

  initialState: {
          username :user.username,
          availableRoles:this.availableRoles,
          selectedRoles:[...user.roles]
    }
  };



  this.bsModelref =this.modalservice.show(RolesModalComponent,config);
  //    this.bsModelref.onHide().subscribe({
  //   next:()=>{

  //     const  selecetedRoles:any= this.bsModelref.content?.selectedRoles;

  //     if(!this.arrayEqual(selecetedRoles!,user.roles)){
  //       this.adminservice.updateUserRoles(user.username,selecetedRoles ).subscribe({
  //         next:roles=>user.roles = roles

  //       })
  //     }
  //   }
  // })



}



private arrayEqual(arr1:any[],arr2:any[]){
    return JSON.stringify(arr1.sort()) ===JSON.stringify(arr2.sort())
}

}
