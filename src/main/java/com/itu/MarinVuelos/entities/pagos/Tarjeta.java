package com.itu.MarinVuelos.entities.pagos;

import com.itu.MarinVuelos.entities.enums.TipoTarjeta;
import com.itu.MarinVuelos.entities.actores.Usuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tarjeta")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Tarjeta extends Pago {

    @Column(name = "numero_tarjeta")
    private String numeroTarjeta;

    @Column(name = "tipo_tarjeta")
    /* ENUM tipo String, persiste string en vez de indice */
    @Enumerated(EnumType.STRING)
    private TipoTarjeta tipoTarjeta;

    /* LAZY para no cargar al usuario con cada Tarjeta */
    @ManyToOne(fetch = FetchType.LAZY)
    /* JoinColumn columna de referencia al usuario */
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
}
