// import { PermisoRol } from './../../seguridad/models/roles.model';
// import { Permiso } from './../../catalogos/models/catalogos.model';
import { Usuario } from "../../seguridad/models/usuarios.model";

export interface SesionJWT {
    aud?:string;
    exp?:number;
    iss?: string;
    nbf?: number;
    usuario?:Usuario;
    modulos?: number[];
    submodulos?: number[];
    permisos?: number[];
}