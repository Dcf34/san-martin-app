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
import { Cliente, FiltroCliente } from '../models/clientes.models';


@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  seccion = '/clientes';
  rutasInicio = rutasAplicativo.inicio;
  jwt:JwtHelperService = new JwtHelperService();

  unsubscribe$: Subject<boolean> = new Subject<boolean>();
  
  constructor(
    private api:ApiService,
    private router:Router,
    private mensajesService:MensajesService
  ) { }

  public getClientes(filtro: FiltroCliente) {
    const url = `${this.seccion}?`+
                `id_cliente=${cleanParamNum(filtro?.id_cliente)}` +
                `&activo=${cleanParamBool(filtro?.activo)}`
    ;

    return this.api.getHttp<Cliente[]>(url);
  }

  public setCliente(cliente: Cliente){
    const url = `${this.seccion}?`;

    idUserModificacionToObject(cliente);

    return this.api.postHttp<Ejecucion>(url, cliente);
  }

  

  
}
