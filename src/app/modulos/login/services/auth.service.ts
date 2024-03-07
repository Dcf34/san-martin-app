import { localStorageKeys } from './../../../core/config/sesion.config';
import { Ejecucion } from '../../../shared/models/ejecucion.models';
import { ApiService } from '../../../core/services/api.service';
import { Sesion, Autenticacion } from '../models/login.models';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { SesionJWT } from '../models/jwt.model';
import {  Subject, takeUntil, lastValueFrom, firstValueFrom } from 'rxjs';
import { rutasAplicativo } from '../../../core/config/routes.config';
import { MensajesService } from '../../../core/services/mensajes.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  seccion = '/autenticacion';
  rutasInicio = rutasAplicativo.login;
  jwt:JwtHelperService = new JwtHelperService();

  unsubscribe$: Subject<boolean> = new Subject<boolean>();
  
  constructor(
    private api:ApiService,
    private router:Router,
    private mensajesService:MensajesService
  ) { }

  public autenticar(sesion:Sesion) {
    const url = `${this.seccion}`;

    const sesionActual:Sesion = {
      Usuario: sesion.Usuario,
      Clave: btoa(sesion.Clave ?? '')
    };

    const data = {
      sesion: sesionActual
    };

    return this.api.postHttp<Autenticacion>(url, data);
  }

  // public async validarAccesoPantalla(idPantalla:number) : Promise<Ejecucion> {
  //   const usuario = this.obtenerUsuario();

  //   if(!usuario){
  //     return { exitoso: false, mensaje: 'No se encontró sesión para el usuario' };
  //   }

  //   const obsvAccesoPantalla = this.api.getHttp<Ejecucion>(`${this.seccion}/pantalla/acceso/${usuario?.id_rol}/${idPantalla}`);

  //   const ejecucion = await lastValueFrom(obsvAccesoPantalla);

  //   if(!ejecucion.exitoso) {
  //     sessionStorage.setItem('mensajeAccesoPantallas', ejecucion.mensaje);
  //     this.router.navigateByUrl(rutasAplicativo.inicio);
  //   }

  //   return ejecucion;
  // }

  public async asignarSesion(token:string): Promise<void> {
    localStorage.setItem(localStorageKeys.token, token);
    const usuario = this.obtenerUsuario();
    
    if(usuario) {
      localStorage.setItem(localStorageKeys.usuario, (usuario.Cuenta_Usuario ?? '').toString());
      localStorage.setItem(localStorageKeys.nombre, (usuario.Nombre ?? '').toString());
      localStorage.setItem(localStorageKeys.correo, (usuario.Correo ?? '').toString());
      localStorage.setItem(localStorageKeys.id_usuario, (usuario.Id_Usuario ?? '').toString());
    }

  }

  public obtenerToken() {
    return localStorage.getItem(localStorageKeys.token) ?? '';
  }

  public obtenerInfoSesion(): SesionJWT {
    const token = this.obtenerToken();
    const sesion: SesionJWT | null = this.jwt.decodeToken(token);
  
    if (sesion === null) {
      throw new Error('Token inválido');
    }
  
    return sesion;
  }


  public obtenerUsuario() {    
    const sesion = this.obtenerInfoSesion();
    return sesion.usuario;
  }

  public obtenerIdUsuarioModificacion() {
    const idUsuario = localStorage.getItem(localStorageKeys.usuario) ?? '';
    return +idUsuario;
  }

  public obtenerDatoSesion(key:string) : string[] {    
    const json = localStorage.getItem(key) ?? '';
    return !json ? [] : JSON.parse(json);
  }

  public expirado() {
    const token = this.obtenerToken();
    return this.jwt.isTokenExpired(token);
  }

  public obtenerFechaExpiracion() {
    const token = this.obtenerToken();
    return this.jwt.getTokenExpirationDate(token);
  }  

  public autenticado(): boolean {
    const token = this.obtenerToken();  
    return token && !this.jwt.isTokenExpired(token) ? true : false;
  }

  limpiarSesion(): void{
    localStorage.removeItem(localStorageKeys.token);
    localStorage.removeItem(localStorageKeys.usuario);
    localStorage.removeItem(localStorageKeys.nombre); 
    localStorage.removeItem(localStorageKeys.correo); 

    window.location.reload();
  }
  
  // siTieneAcceso(idPermiso: number) {
  //   const idsPermisos: number[] = this.obtenerIdsPermisos();
  //   return idsPermisos.includes(idPermiso);
  // }

}
