package com.itu.MarinVuelos.services;

import com.itu.MarinVuelos.entities.logistica.Aerolinea;
import com.itu.MarinVuelos.repositories.BaseRepository;
import org.springframework.stereotype.Service;

@Service
public class AerolineaServiceImpl extends BaseServiceImpl<Aerolinea, Long> implements AerolineaService {
    public AerolineaServiceImpl(BaseRepository<Aerolinea, Long> baseRepository) {
        super(baseRepository);
    }
}
