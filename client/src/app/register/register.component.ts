import { AccountService } from './../_services/account.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{

@Output()   cancelRegister = new EventEmitter()
  model:any={};


constructor(private accountservice:AccountService){

}
  ngOnInit(): void {

  }
  register(){
    console.log(this.model);
    this.accountservice.register(this.model).subscribe(
        {
          next :()=>{

            this.cancel();
          },error:error =>console.log(error)
        }
      )
  }

  cancel(){
    // console.log("cancelled")
    this.cancelRegister.emit(false);
  }
}
