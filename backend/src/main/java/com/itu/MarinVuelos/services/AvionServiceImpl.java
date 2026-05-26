package com.itu.MarinVuelos.services;

import com.itu.MarinVuelos.entities.logistica.Avion;
import com.itu.MarinVuelos.repositories.BaseRepository;
import org.springframework.stereotype.Service;

@Service
public class AvionServiceImpl extends BaseServiceImpl<Avion, Long> implements AvionService {
    public AvionServiceImpl(BaseRepository<Avion, Long> baseRepository) {
        super(baseRepository);
    }
}
