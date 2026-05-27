package com.itu.MarinVuelos.services;

import com.itu.MarinVuelos.entities.logistica.Vuelo;

import java.time.LocalDate;
import java.util.List;

public interface VueloService extends BaseService<Vuelo, Long> {
    List<Vuelo> buscar(LocalDate fechaSalida, Long aerolineaId, Long aeropuertoId, Long pilotoId) throws Exception;
}
