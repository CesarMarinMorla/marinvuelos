package com.itu.MarinVuelos.entities;

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

    @NotNull
    @Column(name = "impuesto_tarifa", precision = 10, scale = 2, nullable = false)
    private BigDecimal impuestoTarifa;

    @NotNull
    @Column(name = "precio_tarifa", precision = 10, scale = 2, nullable = false)
    private BigDecimal precioTarifa;

    @Column(name = "clase_tarifa")
    @Enumerated(EnumType.STRING)
    private Clase claseTarifa;
}
