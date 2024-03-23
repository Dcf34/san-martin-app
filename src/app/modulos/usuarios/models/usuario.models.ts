export interface UsuarioDto {
    id_usuario?: number;
    activo?: boolean;
    fecha_modificacion?: Date;
    id_usuario_modificacion?: number;
    fecha_creacion?: Date;
    id_usuario_creacion?: number;
    nombre?: string;
    correo?: string;
    cuenta_usuario?: string;
    telefono?: string;
}

export interface FiltroUsuario {
    id_usuario?: number;
    activo?: boolean;
    nombre?: string;
    correo?: string;
    cuenta_usuario?: string;
}

export interface UsuarioCreacionDto {
    activo?: boolean;
    fecha_modificacion?: Date;
    id_usuario_modificacion?: number;
    fecha_creacion?: Date;
    id_usuario_creacion?: number;
    nombre?: string;
    correo?: string;
    cuenta_usuario?: string;
    clave?: string;
    telefono?: string;
  }
  
  export interface UsuarioActualizacionDto {
    id_usuario?: number;
    activo?: boolean;
    fecha_modificacion?: Date;
    id_usuario_modificacion?: number;
    nombre?: string;
    correo?: string;
    cuenta_usuario?: string;
    clave?: string;
    telefono?: string;
  }

  export interface UsuarioPerfil {
    id_usuario?: number;
    activo?: boolean;
    fecha_modificacion?: Date;
    id_usuario_modificacion?: number;
    fecha_creacion?: Date;
    id_usuario_creacion?: number;
    nombre?: string;
    correo?: string;
    cuenta_usuario?: string;
    telefono?: string;
    clave?: string;
}