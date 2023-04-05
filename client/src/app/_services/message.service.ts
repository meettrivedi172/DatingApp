import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { getPaginatedResult, paginationHeaders } from './paginationHelper';
import { Messages } from '../_models/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;

  constructor(private http:HttpClient) {

   }

   getMessage(pageNumber:number,pageSize:number,container:string){
    let params= paginationHeaders(pageNumber,pageSize);

    params=params.append('Container',container)
    return getPaginatedResult<Messages[]>(this.baseUrl+'messages',params,this.http);

   }


   getMessageTread(username:string){

    return this.http.get<Messages[]>(this.baseUrl+ 'messages/thread/'+username);

   }


   sendMessage(username:string,content:string){
    return this.http.post<Messages>(this.baseUrl + 'messages' ,{recipientUsername:username,content})

   }

   deleteMessage(id:number){
    return this.http.delete(this.baseUrl + 'messages/' + id)
   }
}
