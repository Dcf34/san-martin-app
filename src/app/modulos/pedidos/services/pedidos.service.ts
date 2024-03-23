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
import { asignDates, idUserCreacionToObject, idUserModificacionToObject, 
userIdToObject, userToForm, userToObject, usuarioToObject } from 'src/app/shared/models/functions/user-modification.function';
import { FiltroPedido, PedidoDAO } from '../models/pedidos.models';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  seccion = '/pedidos';
  rutasInicio = rutasAplicativo.inicio;
  jwt:JwtHelperService = new JwtHelperService();

  unsubscribe$: Subject<boolean> = new Subject<boolean>();
  
  constructor(
    private api:ApiService,
    private router:Router,
    private mensajesService:MensajesService
  ) { }

  public getPedidos(filtro: FiltroPedido) {
    const url = `${this.seccion}?`+
                `id_pedido=${cleanParamNum(filtro?.id_pedido)}` +
                `&activo=${cleanParamBool(filtro?.activo)}`  +
                `&id_cliente=${cleanParamNum(filtro?.id_cliente)}` +
                `&total_desde=${cleanParamDate(filtro?.total_desde)}` +   
                `&total_hasta=${cleanParamDate(filtro?.total_hasta)}`  
    ;

    return this.api.getHttp<PedidoDAO[]>(url);
  }


}
