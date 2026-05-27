package com.itu.MarinVuelos.entities.pagos;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.itu.MarinVuelos.entities.actores.Usuario;
import com.itu.MarinVuelos.entities.enums.TipoTarjeta;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
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

    @Column(name = "numero_tarjeta", nullable = false)
    private String numeroTarjeta;

    @Column(name = "tipo_tarjeta", nullable = false)
    /* ENUM tipo String, persiste string en vez de indice */
    @Enumerated(EnumType.STRING)
    private TipoTarjeta tipoTarjeta;

    /* LAZY para no cargar al usuario con cada Tarjeta */
    @ManyToOne(fetch = FetchType.LAZY)
    /* JoinColumn columna de referencia al usuario */
    @JoinColumn(name = "usuario_id", nullable = false)
    @JsonIgnore
    private Usuario usuario;
}
