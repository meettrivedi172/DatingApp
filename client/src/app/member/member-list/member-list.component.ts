import { AccountService } from 'src/app/_services/account.service';
import { Pagination } from './../../_models/pagination';
import { Component, OnInit } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit{
// members$:Observable<Member[]> | undefined;
member :Member[] =[];

pagination:Pagination |undefined;
pageNumber =1;
pageSize =5;
userParams: UserParams  | undefined;
user:User | undefined;
genderList =[{value:"male",display:"Males"},{value:"female",display:"Females"}]


constructor(private memberservice:MembersService,private accountService:AccountService) {
   this.userParams= this.memberservice.getUserParams();

}

ngOnInit():void{
  //  this.members$ = this.memberservice.getMembers();
  this.loadMembers();
}



resetFilters(){

    this.userParams =this.memberservice.resetUserParams();
    this.loadMembers();
  
}

loadMembers(){
console.log(this.userParams);
  if(this.userParams){
      this.memberservice.setUserParams(this.userParams);
    this.memberservice.getMembers(this.userParams).subscribe({
      next:response=>{
        if(response.result && response.pagination){
          this.member = response.result;
          this.pagination =response.pagination;
          console.log(this.pagination)
        }
      }
    })
  };
}


pageChanged(event:any){

if(this.userParams && this.userParams?.pageNumber !== event.page){

  this.userParams.pageNumber =event.page;
  this.memberservice.setUserParams(this.userParams);
  this.loadMembers();
}


}

}
