import { rutasAplicativo } from './../../core/config/routes.config';
import { AuthService } from './services/auth.service';
import { Autenticacion, Sesion, EstatusAutenticacion } from './models/login.models';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MensajesService } from 'src/app/core/services/mensajes.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  sesion: Sesion = {
    Usuario: '',
    Clave: ''
  };
  
  cargando = false;
  unsubscribe$: Subject<boolean> = new Subject<boolean>();

  redirectUrl = '';

  vistaLogin = true;

  constructor(
    private authService:AuthService,
    private router:Router,
    private activadedRoute:ActivatedRoute,
    private mensajesService:MensajesService)
    { 
      this.activadedRoute.queryParamMap.subscribe((params) => {
      const redirectUrl = params.get('redirectUrl');
      
      if(redirectUrl) 
      {
        this.redirectUrl = redirectUrl;
      }
    });
  }

  typeInput = 'password';
  mostrarLabelUsuario: boolean = true;
  mostrarLabelPass: boolean = true;

  onChangeUsuario(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        this.mostrarLabelUsuario = inputElement.value.trim().length === 0;
        //this.sesion.correo = inputElement.value.trim();
  }
  
  onChangePass(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        this.mostrarLabelPass = inputElement.value.trim().length === 0;
        //this.sesion.contrasenia = inputElement.value.trim();
  }
  
  mostrarContrasenia(event: any) {
    if (event.checked) {
        this.typeInput = 'text';
    } else {
        this.typeInput = 'password';
    }
  }

  ngOnInit(): void {

    if (this.authService.autenticado()) {
        this.navegarPortal();
    }

  }

  autenticar() {

    if(this.sesion.Usuario && this.sesion.Clave) {

      this.cargando = true;

      this.authService
        .autenticar(this.sesion)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: async (autenticacion: Autenticacion) => {

            if(autenticacion.estatus === EstatusAutenticacion.AUTENTICADO) {

              await this.authService.asignarSesion(autenticacion.token);

              this.navegarPortal();
              
              
            } else {
              this.mensajesService.error('Error', autenticacion.mensaje);
            }

            this.cargando = false;

          },
          error: (error) => {
            this.cargando = false;
          }
        });

    }

  }
  navegarPortal() {
    const navigateUrl = this.redirectUrl ? this.redirectUrl : rutasAplicativo.inicio;
    this.router.navigateByUrl(navigateUrl);
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();    
  }
  
}
