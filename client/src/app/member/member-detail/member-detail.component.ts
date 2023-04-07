import { User } from './../../_models/user';
import { Messages } from 'src/app/_models/message';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { MessageService } from 'src/app/_services/message.service';
import { PresenceService } from 'src/app/_services/presence.service';
import { AccountService } from 'src/app/_services/account.service';

import { take } from 'rxjs';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit,OnDestroy{
  @ViewChild('memberTabs' ,{static:true})  memberTabs ?: TabsetComponent;
member :Member| any;
gallerryOption:NgxGalleryOptions[]=[];
galleryImages:NgxGalleryImage[]=[];
activeTab ?: TabDirective;
message:Messages[] =[];
user ?:User;



constructor(private accountservice:AccountService,private memberservice:MembersService,private route:ActivatedRoute,private messageservice:MessageService,public presenceservice:PresenceService,private router:Router){

    this.accountservice.currentUser$.pipe(take(1)).subscribe({
      next:user=>{
        if(user){
          this.user = user;
        }
      }
    })


    this.router.routeReuseStrategy.shouldReuseRoute =() =>false

}

  ngOnInit(): void {
    this.route.data.subscribe({
      next : data =>{

        this.member =data['Member']
      }
    })

this.route.queryParams.subscribe({
  next:params =>{
    params['tab'] && this.selectTab(params['tab'])
  }
})


     this.gallerryOption=[{
      width:"500px",
      height:"500px",
      imagePercent:100,
      thumbnailsColumns:4,
      imageAnimation:NgxGalleryAnimation.Slide,
      preview:false
     }]

     this.galleryImages= this.getImages();

  }

  getImages(){
    if(!this.member)return [];
    const imgUrls = [];
    for(const photo of this.member.photos){
      imgUrls.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url
      })
    }

    return imgUrls;
  }

  loadmember(){
    var username = this.route.snapshot.paramMap.get('username');
    if(!username)return;
    this.memberservice.getmember(username).subscribe({
      next: member=>{
        this.member = member,
        console.log(this.member.userName)
        this.galleryImages= this.getImages();
      }
    })
  }


  selectTab(heading :string){
        if(this.memberTabs){

          this.memberTabs.tabs.find(x=>x.heading===heading)!.active =true
        }


  }

  loadMassages(){


    if(this.member){
       this.messageservice.getMessageTread(this.member.userName).subscribe({
         next : message => this.message = message
     })
     }
   }

onTabActivated(data: TabDirective){
  this.activeTab= data;
  console.log(this.activeTab)
  if(this.activeTab.heading ==="Messages" && this.user){
      // this.loadMassages();
      this.messageservice.createHubConnection(this.user,this.member.userName);
  }else{
    this.messageservice.stopHubConnection();
  }

}
ngOnDestroy(): void {
  this.messageservice.stopHubConnection();
}
}
