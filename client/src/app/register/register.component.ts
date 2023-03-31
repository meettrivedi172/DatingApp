import { Router } from '@angular/router';
import { AccountService } from './../_services/account.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{

@Output()   cancelRegister = new EventEmitter()


  registerForm:FormGroup =new FormGroup({});
  maxDate =new Date();
  validationError :string[]|  undefined;

constructor(private accountservice:AccountService,private tost:ToastrService,private fb:FormBuilder,private router:Router){

}
  ngOnInit(): void {
    this.initializeForm();

    this.maxDate.setFullYear(this.maxDate.getFullYear()-18);

  }


  initializeForm(){

    this.registerForm =this.fb.group({
      gender : ["male"],
      username : ["",Validators.required],
      knownAs : ["",Validators.required],
      dateOfBirth : ["",Validators.required],
      city : ["",Validators.required],
      country : ["",Validators.required],
      password : ["",[Validators.required,Validators.minLength(4),Validators.maxLength(8)]],
      comfirmPassword : ["",[Validators.required,this.matchValues('password')]],
    })

    // this.registerForm.controls['password'].valueChanges.subscribe({
    //   next:()=>this.registerForm.controls?.['confirmPassword'].updateValueAndValidity()
    // })

  }


  matchValues(matchTo:string):ValidatorFn  |any{

return(control:AbstractControl)=>{
  return control.value === control.parent?.get(matchTo)?.value ? null :{notMatching :true}
}
  }


  register(){

    const dob =this.getDateOnly(this.registerForm.controls['dateOfBirth'].value);
    const values ={...this.registerForm.value,dateOfBirth:dob}
    console.log(values);
    // console.log(this.registerForm?.value);
    this.accountservice.register(values).subscribe(
        {
          next :()=>{

            this.router.navigateByUrl('/member')
          },error:error =>
          this.validationError = error
        }
      )
  }

  cancel(){
    // console.log("cancelled")
    this.cancelRegister.emit(false);
  }

private getDateOnly(dob:string | undefined){
  if(!dob)return;
  let theDob = new Date(dob);
  return new Date(theDob.setMinutes(theDob.getMinutes()-theDob.getTimezoneOffset())).toISOString().slice(0,10)
}

}
