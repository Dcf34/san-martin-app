export interface Configuracion {
    id_configuracion?: number;
    activo?: boolean;
    fecha_modificacion?: Date;
    id_usuario_modificacion?: number;
    fecha_creacion?: Date;
    id_usuario_creacion?: number;
    nombre?: string;
    telefono?: string;
    correo?: string;
    direccion?: string;
}