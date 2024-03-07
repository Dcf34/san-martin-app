export interface Sesion {
  Usuario?:string;
  Clave?:string;
}
  
export interface Autenticacion {
estatus: EstatusAutenticacion;
mensaje: string;
token: string;
}

export enum EstatusAutenticacion {
AUTENTICADO = 1,
NO_AUTENTICADO = 2,
USUARIO_NO_EXISTE = 3,
USUARIO_INACTIVO = 4
}
  