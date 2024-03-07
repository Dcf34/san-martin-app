export interface Permiso{
    id_permiso?: number;
    nombre?: string;
}

export interface PermisoUsuario {
    id_permiso_usuario?: number;
    activo?: boolean;
    fecha_modificacion?: Date;
    id_usuario_modificacion?: number;
    fecha_creacion?: Date;
    id_usuario_creacion?: number;
    id_permiso?: number;
    id_usuario?: number;
}