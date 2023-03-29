import { NavigationExtras, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router:Router, private tost:ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(

      catchError((error:HttpErrorResponse)=>{
        if(error){

          switch (error.status) {

            case 400:
              if(error.error.errors){
                const modalStateError = [] ;
                for(const key in  error.error.errors){
                  if(error.error.errors[key]){
                    modalStateError.push(error.error.errors[key])
                  }
                }

                throw  modalStateError.flat();

              }else{
                this.tost.error(error.error,error.status.toString())
              }

              break;
              case 401:

                  this.tost.error("Unothorised",error.status.toString());


                break;
                case 404:
                this.router.navigateByUrl('/not-found');



              break;
              case 500:
                const navigationExtras : NavigationExtras ={ state :{error:error.error}}
                this.router.navigateByUrl('/server-error', navigationExtras);



              break;
              default:
                this.tost.error("somthing unexpected went wrong");
                console.log(error);
                break
          }


        }
        throw error;

      })
    )
  }
}
