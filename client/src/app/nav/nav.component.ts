import { User } from './../_models/user';
import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit{
model:any ={};
// loggedIn = false;
currentUser$ : Observable<User | null> = of(null)
constructor(private  accountservice:AccountService){}


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
    console.log(response);
    // this.loggedIn =true
   },error:error=>console.log(error)
  })
}


logout(){
  this.accountservice.logout();
  // this.loggedIn= false;
}
}
