import { AccountService } from './_services/account.service';
import { HttpClient } from '@angular/common/http';
import { Component,OnInit } from '@angular/core';
import { User } from './_models/user';
import { AdminService } from './_services/admin.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'DatingApp';

  constructor(private http:HttpClient,private accountservice:AccountService,private adminservice:AdminService){

  }

  ngOnInit(): void {

   this.setCurrentUser();

   

  }


  setCurrentUser(){
    const userString = localStorage.getItem('user')
    if(!userString)return;
    const user :User = JSON.parse(userString);
    this.accountservice.setCurrentUser(user);
  }
}
