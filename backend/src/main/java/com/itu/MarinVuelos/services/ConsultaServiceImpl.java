package com.itu.MarinVuelos.services;

import com.itu.MarinVuelos.entities.Consulta;
import com.itu.MarinVuelos.repositories.ConsultaRepository;
import com.itu.MarinVuelos.repositories.ReservaRepository;
import com.itu.MarinVuelos.repositories.UsuarioRepository;
import com.itu.MarinVuelos.repositories.VueloRepository;
import org.springframework.stereotype.Service;

@Service
public class ConsultaServiceImpl extends BaseServiceImpl<Consulta, Long> implements ConsultaService {

    private final UsuarioRepository usuarioRepository;
    private final VueloRepository vueloRepository;
    private final ReservaRepository reservaRepository;

    public ConsultaServiceImpl(ConsultaRepository repository,
                               UsuarioRepository usuarioRepository,
                               VueloRepository vueloRepository,
                               ReservaRepository reservaRepository) {
        super(repository);
        this.usuarioRepository = usuarioRepository;
        this.vueloRepository = vueloRepository;
        this.reservaRepository = reservaRepository;
    }

    @Override
    public Consulta save(Consulta consulta) throws Exception {
        validar(consulta);
        return super.save(consulta);
    }

    @Override
    public Consulta update(Long id, Consulta consulta) throws Exception {
        validar(consulta);
        return super.update(id, consulta);
    }

    private void validar(Consulta consulta) {
        if (consulta.getUsuario() == null || consulta.getUsuario().getId() == null
                || !usuarioRepository.existsById(consulta.getUsuario().getId()))
            throw new IllegalArgumentException("Usuario no encontrado");

        if (consulta.getVuelo() == null || consulta.getVuelo().getId() == null
                || !vueloRepository.existsById(consulta.getVuelo().getId()))
            throw new IllegalArgumentException("Vuelo no encontrado");

        if (!reservaRepository.existsByUsuarioIdAndVueloId(
                consulta.getUsuario().getId(), consulta.getVuelo().getId()))
            throw new IllegalArgumentException("El usuario no tiene una reserva para el vuelo seleccionado.");
    }
}
