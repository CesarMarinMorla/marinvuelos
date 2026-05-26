package com.itu.MarinVuelos.services;

import com.itu.MarinVuelos.entities.logistica.Ciudad;
import com.itu.MarinVuelos.repositories.BaseRepository;
import org.springframework.stereotype.Service;

@Service
public class CiudadServiceImpl extends BaseServiceImpl<Ciudad, Long> implements CiudadService {
    public CiudadServiceImpl(BaseRepository<Ciudad, Long> baseRepository) {
        super(baseRepository);
    }
}
