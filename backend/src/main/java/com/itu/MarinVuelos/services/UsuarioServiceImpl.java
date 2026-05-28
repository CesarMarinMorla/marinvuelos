package com.itu.MarinVuelos.services;

import com.itu.MarinVuelos.entities.actores.Usuario;
import com.itu.MarinVuelos.entities.enums.TipoTarjeta;
import com.itu.MarinVuelos.entities.pagos.Tarjeta;
import com.itu.MarinVuelos.repositories.ConsultaRepository;
import com.itu.MarinVuelos.repositories.ReservaRepository;
import com.itu.MarinVuelos.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;

@Service
public class UsuarioServiceImpl extends BaseServiceImpl<Usuario, Long> implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final ReservaRepository reservaRepository;
    private final ConsultaRepository consultaRepository;

    public UsuarioServiceImpl(
            UsuarioRepository usuarioRepository,
            ReservaRepository reservaRepository,
            ConsultaRepository consultaRepository
    ) {
        super(usuarioRepository);
        this.usuarioRepository = usuarioRepository;
        this.reservaRepository = reservaRepository;
        this.consultaRepository = consultaRepository;
    }

    @Override
    public Usuario save(Usuario usuario) throws Exception {
        usuario.setPassword(usuario.getDni());
        if (usuario.getTarjetas() == null || usuario.getTarjetas().isEmpty()) {
            Tarjeta tarjeta = new Tarjeta();
            tarjeta.setCantidad(BigDecimal.ZERO);
            tarjeta.setNumeroTarjeta(buildCreditCardNumber(usuario.getDni()));
            tarjeta.setTipoTarjeta(TipoTarjeta.CREDITO);
            tarjeta.setUsuario(usuario);
            usuario.setTarjetas(new ArrayList<>(java.util.List.of(tarjeta)));
        } else {
            usuario.getTarjetas().forEach(tarjeta -> tarjeta.setUsuario(usuario));
        }
        return super.save(usuario);
    }

    private String buildCreditCardNumber(String dni) {
        return String.format("4000%012d", Long.parseLong(dni));
    }

    @Override
    public Usuario update(Long id, Usuario entity) throws Exception {
        Usuario existing = findById(id);
        existing.setNombrePersona(entity.getNombrePersona());
        existing.setApellidoPersona(entity.getApellidoPersona());
        existing.setCorreo(entity.getCorreo());
        existing.setDni(entity.getDni());
        return baseRepository.save(existing);
    }

    @Override
    public boolean delete(Long id) throws Exception {
        consultaRepository.deleteByUsuarioId(id);
        reservaRepository.deleteByUsuarioId(id);
        return super.delete(id);
    }

    @Override
    public Usuario findByCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo);
    }
}
