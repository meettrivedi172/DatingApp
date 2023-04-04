import { Component, OnInit } from '@angular/core';
import { Member } from '../_models/member';
import { MembersService } from '../_services/members.service';
import { Pagination } from '../_models/pagination';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit{

member:Member[] | any;
pridicate ='liked';
pageNumber=1;
pageSize=5;
pagination:Pagination | undefined;


constructor(private memberservice:MembersService){}
  ngOnInit():void{

    this.loadLikes();

  }


loadLikes(){

  this.memberservice.getLikes(this.pridicate,this.pageNumber,this.pageSize).subscribe({
    next: response =>{
      console.log(response);
      this.member=response.result;
      this.pagination=response.pagination;
    }
  })

}



pageChanged(event:any){

  if(this.pageNumber !== event.page){

    this.pageNumber =event.page;
    this.loadLikes();
  }


  }
}
