export interface Comida {
    id_comida?: number;
    activo?: boolean;
    fecha_modificacion?: Date;
    id_usuario_modificacion?: number;
    fecha_creacion?: Date;
    id_usuario_creacion?: number;
    codigo?: string;
    nombre?: string;
    precio?: number;
    descripcion?: string;
}

export interface FiltroComida {
    id_comida?: number;
    activo?: boolean;
}