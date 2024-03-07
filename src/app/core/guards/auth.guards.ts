import { AuthService } from '../../modulos/login/services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  /**
   *
   */
  constructor(
    private authService:AuthService, 
    private router: Router
  ) { 
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const url = state.url;      
    return this.validarAutenticacion(url);
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const url = state.url;      
      return this.validarAutenticacion(url);
  }

  validarAutenticacion(redirectUrl:string) :boolean {
    const linkLogin = '/login';
    const portalLogin = '/portal';

    if (this.authService.autenticado()) {
      return true;
    } else {      
      const loginWithRedirect = redirectUrl && redirectUrl != portalLogin ? `${linkLogin}?redirectUrl=${redirectUrl}` : linkLogin;      
      this.router.navigateByUrl(loginWithRedirect);
      return false;
    }
  }
  
}
