package com.itu.MarinVuelos.services;

import com.itu.MarinVuelos.entities.logistica.Vuelo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface VueloService extends BaseService<Vuelo, Long> {
    Page<Vuelo> buscar(LocalDate fechaSalida, Long aerolineaId, Long aeropuertoOrigenId, Long aeropuertoDestinoId, Pageable pageable) throws Exception;
}
