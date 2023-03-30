import { Member } from './../_models/member';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;

  constructor(private http:HttpClient) { }

  getMembers(){
    return this.http.get<Member[]>(this.baseUrl+'users')
  }

getmember(username:string){

  return this.http.get<Member>(this.baseUrl+'users/'+username)

}

  // getHttpOption(){

  //  const userString = localStorage.getItem('user');
  //  if(!userString)return;
  //  const user = JSON.parse(userString);
  //  return{
  //   headers : new HttpHeaders({
  //     Authorization : 'Bearer '  + user.token
  //   })
  //  }

  // }

  
}
