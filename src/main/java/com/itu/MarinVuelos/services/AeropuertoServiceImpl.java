package com.itu.MarinVuelos.services;

import com.itu.MarinVuelos.entities.logistica.Aeropuerto;
import com.itu.MarinVuelos.repositories.BaseRepository;
import org.springframework.stereotype.Service;

@Service
public class AeropuertoServiceImpl extends BaseServiceImpl<Aeropuerto, Long> implements AeropuertoService {
    public AeropuertoServiceImpl(BaseRepository<Aeropuerto, Long> baseRepository) {
        super(baseRepository);
    }
}
