package com.itu.MarinVuelos.entities.pagos;

import com.itu.MarinVuelos.entities.Base;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

/*
Decision personal, uso de clase abstracta en vez de clase concreta,
Reserva referencia directamente a Tarjeta, clase hija
 */

@MappedSuperclass
@Getter
@Setter
public abstract class Pago extends Base {

    @NotNull
    @Column(name = "cantidad",  precision = 10, scale = 2, nullable = false)
    protected BigDecimal cantidad;
}
