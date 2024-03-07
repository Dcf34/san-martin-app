import { AuthService } from '../../modulos/login/services/auth.service';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { apiHost, apiPrefix } from '../config/api.config';
import { rutasAplicativo } from '../config/routes.config';
import { NavigationExtras, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { MensajesService } from '../services/mensajes.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  apiUrl = `${apiHost}${apiPrefix}`;

  urlsNotToUse = [
    this.apiUrl + rutasAplicativo.login,
  ]; 

  constructor(
    private authService:AuthService,
    private mensajesService:MensajesService,
    private router:Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {    

    let url = request.url.includes('?') ? request.url.split('?')[0] : request.url; // Se quitan query params

    let isHttp:boolean = url.includes('http') || url.includes('https');

    if (isHttp && !this.urlsNotToUse.includes(url)) {
        
        const token = this.authService.obtenerToken();
        let newRequest = request;

        if (token !== null) {
          newRequest = request.clone({
            setHeaders: {
                'Authorization': `Bearer ${token}`
            }
        });
      }

        return next.handle(newRequest).pipe(
          catchError((error:HttpErrorResponse) => {

            if (error.status === 401) {

              const navExtras:NavigationExtras = {
                queryParams: {
                  unauthorized : true
                }
              };

              this.authService.limpiarSesion();
              
              this.router.navigateByUrl(rutasAplicativo.login, navExtras);
            }

            this.mensajesService.httpError(error);

            return throwError(error);
          })
        ) as Observable<HttpEvent<any>>;
    }

    return next.handle(request).pipe(
      catchError((error:HttpErrorResponse) => {
        this.mensajesService.httpError(error);
        return throwError(error);
      })
    ) as Observable<HttpEvent<any>>;
  }
}
 