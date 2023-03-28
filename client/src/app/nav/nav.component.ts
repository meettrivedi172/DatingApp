import { User } from './../_models/user';
import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit{
model:any ={};
// loggedIn = false;
currentUser$ : Observable<User | null> = of(null)
constructor(private  accountservice:AccountService,private router:Router,private tost:ToastrService){}


ngOnInit(): void {
  //  this.getCurrentUser();
  this.currentUser$ = this.accountservice.currentUser$;
}

getCurrentUser(){
  this.accountservice.currentUser$.subscribe({
    next : user=>
      // this.loggedIn = !!user
      console.log(user)
      ,
      error:error=>console.log(error)

  })
}

login(){
  // console.log(this.model)
  this.accountservice.login(this.model).subscribe({
    next: response=>
   {
     this.router.navigateByUrl('/members')
    // this.loggedIn =true
   },error:error=>this.tost.error(error.error)
  })
}


logout(){
  this.accountservice.logout();
  this.router.navigateByUrl('/')
  // this.loggedIn= false;
}
}
