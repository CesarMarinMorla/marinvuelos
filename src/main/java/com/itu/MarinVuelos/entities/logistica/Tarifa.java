package com.itu.MarinVuelos.entities.logistica;

import com.itu.MarinVuelos.entities.Base;
import com.itu.MarinVuelos.entities.enums.Clase;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "tarifa")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Tarifa extends Base {

    @Column(name = "clase_tarifa")
    @Enumerated(EnumType.STRING)
    private Clase claseTarifa;

    // precio + impuesto se calcula en runtime

    @NotNull
    @Column(name = "precio_tarifa", precision = 10, scale = 2, nullable = false)
    private BigDecimal precioTarifa;

    @NotNull
    @Column(name = "impuesto_tarifa", precision = 10, scale = 2, nullable = false)
    private BigDecimal impuestoTarifa;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vuelo_id", nullable = false)
    private Vuelo vuelo;
}
