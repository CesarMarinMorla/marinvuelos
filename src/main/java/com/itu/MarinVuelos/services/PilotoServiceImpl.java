package com.itu.MarinVuelos.services;

import com.itu.MarinVuelos.entities.actores.Piloto;
import com.itu.MarinVuelos.repositories.BaseRepository;
import com.itu.MarinVuelos.repositories.PilotoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PilotoServiceImpl extends BaseServiceImpl<Piloto, Long> implements PilotoService {

    @Autowired
    private PilotoRepository pilotoRepository;

    public PilotoServiceImpl(BaseRepository<Piloto, Long> baseRepository) {
        super(baseRepository);
    }
}
