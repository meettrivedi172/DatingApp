import { map, of } from 'rxjs';
import { Member } from './../_models/member';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  member:Member[]=[];

  constructor(private http:HttpClient) { }

  getMembers(){
    if(this.member.length>0)return of(this.member);
    return this.http.get<Member[]>(this.baseUrl+'users').pipe(map(member=>{
      this.member = member;
      return member;

    }))
  }

getmember(username:string){
   const member = this.member.find(x=>x.userName===username);
   if(member) return of(member);
  return this.http.get<Member>(this.baseUrl+'users/'+username)

}

updateMember(member:Member){

  return this.http.put(this.baseUrl+'users',member).pipe(map(()=>{
const index = this.member.indexOf(member);
  this.member[index] ={...this.member[index],...member}
  }));
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
