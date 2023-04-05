import { Messages } from 'src/app/_models/message';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit{
  @ViewChild('memberTabs' ,{static:true})  memberTabs ?: TabsetComponent;
member :Member| any;
gallerryOption:NgxGalleryOptions[]=[];
galleryImages:NgxGalleryImage[]=[];
activeTab ?: TabDirective;
message:Messages[] =[];
constructor(private memberservice:MembersService,private route:ActivatedRoute,private messageservice:MessageService){}

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
  if(this.activeTab.heading ==="Messages"){
      this.loadMassages();
  }

}



}
