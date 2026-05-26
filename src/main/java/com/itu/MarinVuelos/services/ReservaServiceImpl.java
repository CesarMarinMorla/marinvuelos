package com.itu.MarinVuelos.services;

import com.itu.MarinVuelos.entities.Reserva;
import com.itu.MarinVuelos.repositories.ReservaRepository;
import com.itu.MarinVuelos.repositories.UsuarioRepository;
import com.itu.MarinVuelos.repositories.VueloRepository;
import org.springframework.stereotype.Service;

@Service
public class ReservaServiceImpl extends BaseServiceImpl<Reserva, Long> implements ReservaService {

    private final UsuarioRepository usuarioRepository;
    private final VueloRepository vueloRepository;

    public ReservaServiceImpl(ReservaRepository repository,
                              UsuarioRepository usuarioRepository,
                              VueloRepository vueloRepository) {
        super(repository);
        this.usuarioRepository = usuarioRepository;
        this.vueloRepository = vueloRepository;
    }

    @Override
    public Reserva save(Reserva reserva) throws Exception {
        validar(reserva);
        return super.save(reserva);
    }

    @Override
    public Reserva update(Long id, Reserva reserva) throws Exception {
        validar(reserva);
        return super.update(id, reserva);
    }

    private void validar(Reserva reserva) {
        if (reserva.getUsuario() == null || reserva.getUsuario().getId() == null
                || !usuarioRepository.existsById(reserva.getUsuario().getId()))
            throw new IllegalArgumentException("Usuario no encontrado");

        if (reserva.getVuelo() == null || reserva.getVuelo().getId() == null
                || !vueloRepository.existsById(reserva.getVuelo().getId()))
            throw new IllegalArgumentException("Vuelo no encontrado");
    }
}
