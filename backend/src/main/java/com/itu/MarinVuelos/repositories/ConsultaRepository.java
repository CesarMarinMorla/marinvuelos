package com.itu.MarinVuelos.repositories;

import com.itu.MarinVuelos.entities.Consulta;
import org.springframework.stereotype.Repository;

@Repository
public interface ConsultaRepository extends BaseRepository<Consulta, Long> {
    long deleteByUsuarioId(Long usuarioId);
}
