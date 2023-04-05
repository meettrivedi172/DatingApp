import { UserParams } from 'src/app/_models/userParams';
import { PaginatedResult, Pagination } from './../_models/pagination';
import { Photo } from './../_models/photo';
import { map, of, take } from 'rxjs';
import { Member } from './../_models/member';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccountService } from './account.service';
import { User } from '../_models/user';
import { getPaginatedResult, paginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  member:Member[]=[];
  memberCache= new Map();
  user:User|undefined;
  userParams:UserParams|undefined;
  getPaginationHeaders:any;
  constructor(private http:HttpClient,private accountservice:AccountService) {
    this.accountservice.currentUser$.pipe(take(1)).subscribe({
      next : user=>{

        if(user){
          this.userParams = new UserParams(user);
          this.user = user;
        }
      }
    })

   }

  getMembers(userparams:UserParams){
    const response = this.memberCache.get(Object.values(userparams).join("-"));
    if(response) return of(response)

    let params = paginationHeaders(userparams.pageNumber,userparams.pageSize);

    params = params.append("minAge",userparams.minAge )
    params = params.append("maxAge",userparams.maxAge )
    params = params.append("gender",userparams.gender )
    params = params.append("orderBy",userparams.orderBy)

    return getPaginatedResult<Member[]>(this.baseUrl + 'users',params,this.http).pipe(map(response=>{
      this.memberCache.set(Object.values(userparams).join('-'),response);
      return response;
    }))
  }

  // private getPaginatedResult<T>(url:string,params: HttpParams) {


  // const paginatedResult:PaginatedResult<T> = new PaginatedResult<T>;
  //   return this.http.get<T>(url, { observe: 'response', params }).pipe(
  //     map(response => {
  //       if (response.body) {
  //       paginatedResult.result = response.body;
  //       }
  //       const pagination = response.headers.get('Pagination');
  //       if (pagination) {
  //         paginatedResult.pagination = JSON.parse(pagination);
  //       }

  //       return paginatedResult;

  //     }
  //     )
  //   );
  // }

  getUserParams(){
    return this.userParams;

  }

  setUserParams(params:UserParams){
    this.userParams = params;
  }

  resetUserParams(){
    if(this.user){
      this.userParams=new UserParams(this.user);
      return this.userParams;
    }
    return;
  }
  // private paginationHeaders(pageNumber:number,pageSize:number) {
  //   let params = new HttpParams();

  //     params = params.append('pageNumber', pageNumber);
  //     params = params.append('pageSize', pageSize);

  //   return params;
  // }

getmember(username:string){
  const member = [...this.memberCache.values()].reduce((arr,elm)=>arr.concat(elm.result),[]).find((member:Member)=>{member.userName===username})
  console.log(member);
  if(member)return of(member);
  return this.http.get<Member>(this.baseUrl+'users/'+username)

}

updateMember(member:Member){

  return this.http.put(this.baseUrl+'users',member).pipe(map(()=>{
const index = this.member.indexOf(member);
  this.member[index] ={...this.member[index],...member}
  }));
}


setMainPhoto(PhotoId:number){

  return this.http.put(this.baseUrl+"users/set-main-photo/"+PhotoId,{} )

}


deletePhoto(photoId: number){
  return this.http.delete(this.baseUrl + "users/delete-photo/"+photoId)
}



addLike(username:string){
  return this.http.post(this.baseUrl+'likes/'+ username ,{});

}

getLikes(pradicate:string,pageNumber:number,pageSize:number){
  let params = paginationHeaders(pageNumber,pageSize)
  params = params.append('predicate',pradicate)

  return  getPaginatedResult<Member[]>(this.baseUrl+ 'likes' , params,this.http)
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
