import { NgForm } from '@angular/forms';
import { MessageService } from './../../_services/message.service';
import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Messages } from 'src/app/_models/message';

@Component({
  changeDetection:ChangeDetectionStrategy.OnPush,
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent   implements OnInit {
@ViewChild('messageForm') messageForm?:NgForm;
@Input()  username:string|any;


messageContent = '';



  constructor(public messageService:MessageService){}



  ngOnInit(): void {


  }


  sendMessage(){
    if(!this.username)return;
    this.messageService.sendMessage(this.username,this.messageContent).then(()=>{
      this.messageForm?.reset();
    })

  }

}
