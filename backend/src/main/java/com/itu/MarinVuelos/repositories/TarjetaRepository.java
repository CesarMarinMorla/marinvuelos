package com.itu.MarinVuelos.repositories;

import com.itu.MarinVuelos.entities.pagos.Tarjeta;
import org.springframework.stereotype.Repository;

@Repository
public interface TarjetaRepository extends BaseRepository<Tarjeta, Long> {
}
