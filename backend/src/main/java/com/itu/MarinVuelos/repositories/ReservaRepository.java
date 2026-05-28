package com.itu.MarinVuelos.repositories;

import com.itu.MarinVuelos.entities.Reserva;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservaRepository extends BaseRepository<Reserva, Long> {
    boolean existsByUsuarioIdAndVueloId(Long usuarioId, Long vueloId);
    boolean existsByUsuarioIdAndVueloIdAndIdNot(Long usuarioId, Long vueloId, Long id);
    List<Reserva> findByUsuarioId(Long usuarioId);
}
