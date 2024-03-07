import { Ejecucion } from '../../shared/models/ejecucion.models';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { disableDebugTools } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class MensajesService {
  duracionGeneral = 5;

  constructor(private message: MessageService) {}

  ejecucion(ejecucion: Ejecucion, titulo: string, duracion: number = this.duracionGeneral) {
    if (ejecucion.exitoso) {
      this.exitoso(titulo, ejecucion.mensaje, duracion);
    } else {
      this.error(titulo, ejecucion.mensaje, duracion);
    }
  }

  exitoso(titulo: string, detalle: string, duracion: number = this.duracionGeneral) {
    this.message.add({
      severity: 'success',
      summary: titulo,
      detail: detalle
    });

    setTimeout(() => {
      this.limpiar();
    }, duracion * 1000);

  }

  advertencia(titulo: string, detalle: string, sticky: boolean = false) {
    this.message.add({
      severity: 'warn',
      summary: titulo,
      detail: detalle,
      sticky
    });
  }

  error(titulo: string, detalle: string, duracion: number = this.duracionGeneral) {
    this.message.add({
      severity: 'error',
      summary: titulo,
      detail: detalle
    });

    setTimeout(() => {
      this.limpiar();
    }, duracion * 1000);
  }

  httpError(httpError: any) {
    console.log(httpError.error);

    let error: string = httpError.error && httpError.error.mensaje ? httpError.error.mensaje : httpError.message;

    this.message.add({
      severity: 'error',
      summary: 'Excepción Inesperada',
      detail: error
    });
  }

  limpiar() {
    this.message.clear();
  }
}
