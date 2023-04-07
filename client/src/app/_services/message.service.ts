import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { getPaginatedResult, paginationHeaders } from './paginationHelper';
import { Messages } from '../_models/message';
import { User } from '../_models/user';
import { BehaviorSubject, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;
  hubUrl= environment.hubUrl;
  private hubConnection?:HubConnection
private messagethreadsource = new BehaviorSubject<Messages[]>([])
   messageThread$ = this.messagethreadsource.asObservable();
  constructor(private http:HttpClient) {

   }

   createHubConnection(user:User,otherUsername:string){
      this.hubConnection = new HubConnectionBuilder().withUrl(this.hubUrl+"message?user=" + otherUsername,{
        accessTokenFactory:()=>user.token
      }).withAutomaticReconnect().build();

      this.hubConnection.start().catch(error=>console.log(error));
      this.hubConnection.on('ReceiveMessageThread',message=>{
          this.messagethreadsource.next(message)
      })
      this.hubConnection.on('NewMessage',message =>{
        this.messageThread$.pipe(take(1)).subscribe({
          next:messages =>{
            this.messagethreadsource.next([...messages,message])
          }
        })
      })



   }

   stopHubConnection(){

    if(this.hubConnection){

      this.hubConnection?.stop();
    }

   }

   getMessage(pageNumber:number,pageSize:number,container:string){
    let params= paginationHeaders(pageNumber,pageSize);

    params=params.append('Container',container)
    return getPaginatedResult<Messages[]>(this.baseUrl+'messages',params,this.http);

   }


   getMessageTread(username:string){

    return this.http.get<Messages[]>(this.baseUrl+ 'messages/thread/'+username);

   }


   async sendMessage(username:string,content:string){
    // return this.http.post<Messages>(this.baseUrl + 'messages' ,{recipientUsername:username,content})

    return this.hubConnection?.invoke('SendMessage',{recipientUsername:username,content}).catch(error=>console.log(error))


   }

   deleteMessage(id:number){
    return this.http.delete(this.baseUrl + 'messages/' + id)
   }
}
