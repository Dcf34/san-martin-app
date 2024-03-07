export interface SesionJWT {
    aud?: string;
    exp?: number;
    idGrupoSeguridad?: number;
    idGrupoSeguridadLit?: number;
    idGrupoSeguridadTram?: number;
    idGrupoSeguridadAuditoria?: number;
    idUsuario?: number;
    idPlaza?: number;
    iss?: string;
    nbf?: number;
    responsabilidades?: string[];
    usuario?: string;
  }
  