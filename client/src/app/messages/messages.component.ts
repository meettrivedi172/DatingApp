import { Component, OnInit } from '@angular/core';

import { Pagination } from '../_models/pagination';
import { MessageService } from '../_services/message.service';
import { Messages } from '../_models/message';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent  implements OnInit {
 message ?:Messages[] ;
 pagination?:Pagination;
 container ='Inbox';
 pageNumber=1;
 pageSize=5;
 loading = false;


   constructor(private messageservice:MessageService){}
  ngOnInit(): void {


    this.loadMessage();

  }

  loadMessage(){
    this.loading =true;
    this.messageservice.getMessage(this.pageNumber,this.pageSize,this.container).subscribe({
      next: response=>{
        // console.log(response)
        this.message = response.result;
        console.log(this.message)
        this.pagination = response.pagination;
        this.loading=false;
      }
    })
  }

deletemessage(massage:any){
  console.log(massage[0].id)

  this.messageservice.deleteMessage(massage[0].id).subscribe({
    next:()=>{
      this.message?.splice(this.message.findIndex(m=>m.id === massage[0].id),1)
    }
  })

}
  pagechanged(event:any){

    if(this.pageNumber !== event.page){
      this.pageNumber =event.page;
      this.loadMessage();
    }

  }

}
