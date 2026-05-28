package com.itu.MarinVuelos.services;

import com.itu.MarinVuelos.entities.Reserva;
import com.itu.MarinVuelos.entities.logistica.Tarifa;
import com.itu.MarinVuelos.repositories.ReservaRepository;
import com.itu.MarinVuelos.repositories.TarifaRepository;
import com.itu.MarinVuelos.repositories.UsuarioRepository;
import com.itu.MarinVuelos.repositories.VueloRepository;
import org.springframework.stereotype.Service;

@Service
public class ReservaServiceImpl extends BaseServiceImpl<Reserva, Long> implements ReservaService {

    private final ReservaRepository reservaRepository;
    private final UsuarioRepository usuarioRepository;
    private final VueloRepository vueloRepository;
    private final TarifaRepository tarifaRepository;

    public ReservaServiceImpl(ReservaRepository repository,
                              UsuarioRepository usuarioRepository,
                              VueloRepository vueloRepository,
                              TarifaRepository tarifaRepository) {
        super(repository);
        this.reservaRepository = repository;
        this.usuarioRepository = usuarioRepository;
        this.vueloRepository = vueloRepository;
        this.tarifaRepository = tarifaRepository;
    }

    @Override
    public Reserva save(Reserva reserva) throws Exception {
        validarParaAlta(reserva);
        return super.save(reserva);
    }

    @Override
    public Reserva update(Long id, Reserva reserva) throws Exception {
        validarParaActualizacion(id, reserva);
        return super.update(id, reserva);
    }

    private void validarParaAlta(Reserva reserva) {
        validarDatosBase(reserva);
        if (reservaRepository.existsByUsuarioIdAndVueloId(
                reserva.getUsuario().getId(), reserva.getVuelo().getId())) {
            throw new IllegalArgumentException("El usuario ya tiene una reserva para ese vuelo");
        }
    }

    private void validarParaActualizacion(Long id, Reserva reserva) {
        validarDatosBase(reserva);
        if (reservaRepository.existsByUsuarioIdAndVueloIdAndIdNot(
                reserva.getUsuario().getId(), reserva.getVuelo().getId(), id)) {
            throw new IllegalArgumentException("El usuario ya tiene una reserva para ese vuelo");
        }
    }

    private void validarDatosBase(Reserva reserva) {
        if (reserva.getUsuario() == null || reserva.getUsuario().getId() == null
                || !usuarioRepository.existsById(reserva.getUsuario().getId()))
            throw new IllegalArgumentException("Usuario no encontrado");

        if (reserva.getVuelo() == null || reserva.getVuelo().getId() == null
                || !vueloRepository.existsById(reserva.getVuelo().getId()))
            throw new IllegalArgumentException("Vuelo no encontrado");

        if (reserva.getTarifa() == null || reserva.getTarifa().getId() == null)
            throw new IllegalArgumentException("Tarifa requerida");

        Tarifa tarifa = tarifaRepository.findById(reserva.getTarifa().getId())
                .orElseThrow(() -> new IllegalArgumentException("Tarifa no encontrada"));

        if (tarifa.getVuelo() == null || tarifa.getVuelo().getId() == null
                || !tarifa.getVuelo().getId().equals(reserva.getVuelo().getId()))
            throw new IllegalArgumentException("La tarifa no corresponde al vuelo seleccionado");

        reserva.setTarifa(tarifa);
    }
}
