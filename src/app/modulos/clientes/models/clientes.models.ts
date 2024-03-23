export interface Cliente {
    id_cliente?: number;
    activo?: boolean;
    fecha_modificacion?: Date;
    id_usuario_modificacion?: number;
    fecha_creacion?: Date;
    id_usuario_creacion?: number;
    nombre?: string;
    telefono?: string;
    direccion?: string;
    idYNombre?: string;
}

export interface FiltroCliente {
    id_cliente?: number;
    activo?: boolean;
}