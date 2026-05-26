package com.itu.MarinVuelos.services;

import com.itu.MarinVuelos.entities.logistica.Vuelo;
import com.itu.MarinVuelos.repositories.AerolineaRepository;
import com.itu.MarinVuelos.repositories.AvionRepository;
import com.itu.MarinVuelos.repositories.AeropuertoRepository;
import com.itu.MarinVuelos.repositories.PilotoRepository;
import com.itu.MarinVuelos.repositories.VueloRepository;
import org.springframework.stereotype.Service;

@Service
public class VueloServiceImpl extends BaseServiceImpl<Vuelo, Long> implements VueloService {

    private final AerolineaRepository aerolineaRepository;
    private final AvionRepository avionRepository;
    private final PilotoRepository pilotoRepository;
    private final AeropuertoRepository aeropuertoRepository;

    public VueloServiceImpl(VueloRepository repository,
                            AerolineaRepository aerolineaRepository,
                            AvionRepository avionRepository,
                            PilotoRepository pilotoRepository,
                            AeropuertoRepository aeropuertoRepository) {
        super(repository);
        this.aerolineaRepository = aerolineaRepository;
        this.avionRepository = avionRepository;
        this.pilotoRepository = pilotoRepository;
        this.aeropuertoRepository = aeropuertoRepository;
    }

    @Override
    public Vuelo save(Vuelo vuelo) throws Exception {
        validar(vuelo);
        return super.save(vuelo);
    }

    @Override
    public Vuelo update(Long id, Vuelo vuelo) throws Exception {
        validar(vuelo);
        return super.update(id, vuelo);
    }

    private void validar(Vuelo vuelo) {
        if (vuelo.getAerolinea() == null || vuelo.getAerolinea().getId() == null
                || !aerolineaRepository.existsById(vuelo.getAerolinea().getId()))
            throw new IllegalArgumentException("Aerolinea no encontrada");

        if (vuelo.getAvion() == null || vuelo.getAvion().getId() == null
                || !avionRepository.existsById(vuelo.getAvion().getId()))
            throw new IllegalArgumentException("Avion no encontrado");

        if (vuelo.getPiloto() == null || vuelo.getPiloto().getId() == null
                || !pilotoRepository.existsById(vuelo.getPiloto().getId()))
            throw new IllegalArgumentException("Piloto no encontrado");

        if (vuelo.getAeropuertos() == null || vuelo.getAeropuertos().isEmpty())
            throw new IllegalArgumentException("Se requiere al menos un aeropuerto");

        vuelo.getAeropuertos().forEach(a -> {
            if (a.getId() == null || !aeropuertoRepository.existsById(a.getId()))
                throw new IllegalArgumentException("Aeropuerto no encontrado: " + a.getId());
        });

        if (vuelo.getFechaSalida() == null || vuelo.getFechaLlegada() == null)
            throw new IllegalArgumentException("Fechas de salida y llegada son requeridas");

        if (!vuelo.getFechaSalida().isBefore(vuelo.getFechaLlegada()))
            throw new IllegalArgumentException("fechaSalida debe ser anterior a fechaLlegada");
    }
}
