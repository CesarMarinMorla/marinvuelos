package com.itu.MarinVuelos.repositories;

import com.itu.MarinVuelos.entities.logistica.Avion;
import org.springframework.stereotype.Repository;

@Repository
public interface AvionRepository extends BaseRepository<Avion, Long> {
}
