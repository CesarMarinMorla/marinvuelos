package com.itu.MarinVuelos.services;

import com.itu.MarinVuelos.entities.logistica.Vuelo;
import com.itu.MarinVuelos.repositories.VueloRepository;
import org.springframework.stereotype.Service;

@Service
public class VueloServiceImpl extends BaseServiceImpl<Vuelo, Long> implements VueloService {

    public VueloServiceImpl(VueloRepository repository) {
        super(repository);
    }
}
