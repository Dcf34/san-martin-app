import { localStorageKeys } from './../../../core/config/sesion.config';
import { Ejecucion } from '../../../shared/models/ejecucion.models';
import { ApiService } from '../../../core/services/api.service';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { SesionJWT } from '../../login/models/jwt.model';
import {  Subject, takeUntil, lastValueFrom, firstValueFrom } from 'rxjs';
import { rutasAplicativo } from '../../../core/config/routes.config';
import { MensajesService } from '../../../core/services/mensajes.service';
import { cleanParam, cleanParamBool, cleanParamDate, cleanParamNum } from 'src/app/shared/models/functions/params.function';
import { asignDates, idUserCreacionToObject, idUserModificacionToObject, userIdToObject, userToForm, userToObject, usuarioToObject } from 'src/app/shared/models/functions/user-modification.function';
import { FiltroUsuario, UsuarioActualizacionDto, UsuarioCreacionDto, UsuarioDto } from '../models/usuario.models';
import { PermisoUsuario } from '../models/permiso.models';


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  seccion = '/usuarios';
  rutasInicio = rutasAplicativo.inicio;
  jwt:JwtHelperService = new JwtHelperService();

  unsubscribe$: Subject<boolean> = new Subject<boolean>();
  
  constructor(
    private api:ApiService,
    private router:Router,
    private mensajesService:MensajesService
  ) { }

  public getUsuarios(filtro: FiltroUsuario) {
    usuarioToObject(filtro);

    const url = `${this.seccion}?`+
                `id_usuario=${cleanParamNum(filtro?.id_usuario)}` +
                `&activo=${cleanParamBool(filtro?.activo)}` +
                `&nombre=${cleanParam(filtro?.nombre)}` +
                `&correo=${cleanParam(filtro?.correo)}` +
                `&cuenta_usuario=${cleanParam(filtro?.cuenta_usuario)}`
    ;

    return this.api.getHttp<UsuarioDto[]>(url);
  }

  public getPermisosUsuario(id_usuario: number) {

    const url = `${this.seccion}/permisos?`+
                `id_usuario=${cleanParamNum(id_usuario)}`
    ;

    return this.api.getHttp<PermisoUsuario[]>(url);
  }


  public updateUsuario(usuario: UsuarioActualizacionDto){
    const url = `${this.seccion}/actualizar?`+
    idUserModificacionToObject(usuario);
    return this.api.putHttp<Ejecucion>(url, usuario);
  }

  public crearUsuario(usuario: UsuarioCreacionDto){
    const url = `${this.seccion}/crear?`+
    
    idUserCreacionToObject(usuario);
    idUserModificacionToObject(usuario);

    asignDates(usuario);
    return this.api.postHttp<Ejecucion>(url, usuario);
  }

  public setPermisosUsuario(permisosUsuario: PermisoUsuario[]){
    const url = `${this.seccion}/permisos/set?`;

    return this.api.postHttp<Ejecucion>(url, permisosUsuario);
  }

  public deleteUsuario(id_usuario: number){
    const url = `${this.seccion}/delete?`+
                `id_usuario=${cleanParamNum(id_usuario)}`
    ;

    return this.api.deleteHttp<Ejecucion>(url);
  }

  
}
