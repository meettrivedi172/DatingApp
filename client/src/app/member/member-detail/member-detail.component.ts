import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit{
member:Member |undefined;
gallerryOption:NgxGalleryOptions[]=[];
galleryImages:NgxGalleryImage[]=[];
constructor(private memberservice:MembersService,private route:ActivatedRoute){}

  ngOnInit(): void {
     this.loadmember();

     this.gallerryOption=[{
      width:"500px",
      height:"500px",
      imagePercent:100,
      thumbnailsColumns:4,
      imageAnimation:NgxGalleryAnimation.Slide,
      preview:false
     }]

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
        this.galleryImages= this.getImages();
      }
    })
  }

}
