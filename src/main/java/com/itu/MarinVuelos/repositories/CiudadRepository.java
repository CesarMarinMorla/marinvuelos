package com.itu.MarinVuelos.repositories;

import com.itu.MarinVuelos.entities.logistica.Ciudad;
import org.springframework.stereotype.Repository;

@Repository
public interface CiudadRepository extends BaseRepository<Ciudad, Long> {
}
