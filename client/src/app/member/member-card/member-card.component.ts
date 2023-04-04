import { MembersService } from 'src/app/_services/members.service';
import { Member } from './../../_models/member';
import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent  implements OnInit {
@Input() member:Member | undefined;


constructor(private memberservice:MembersService,private toast:ToastrService) {


}

ngOnInit(): void {

}


addLike(member:Member){
    this.memberservice.addLike(member.userName).subscribe({
      next: ()=>{
        this.toast.success('You have liked ' + member.knownAs);
      }
    })
}
}
