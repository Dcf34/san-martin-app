export interface PedidoDAO{
    id_pedido?: number;
    activo?: boolean;
    fecha_modificacion?: Date;
    id_usuario_modificacion?: number;
    fecha_creacion?: Date;
    id_usuario_creacion?: number;
    id_cliente?: number;
    nombre_cliente?: string;
    id_venta?: number;
    total?: number;
}

export interface FiltroPedido{
    id_pedido?: number;
    activo?: boolean;
    id_cliente?: number;
    total_desde?: Date,
    total_hasta?: Date;
}