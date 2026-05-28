package com.itu.MarinVuelos.entities.pagos;

import com.itu.MarinVuelos.entities.Base;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * Clase abstracta para medios de pago. Decision personal: uso clase abstracta en vez de concreta
 * Estrategia JOINED, genera tabla propia para {@code pago} y una por subclase, compartiendo el mismo PK
 */
@Entity
@Table(name = "pago")
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
public abstract class Pago extends Base {

    @NotNull
    @Column(name = "cantidad",  precision = 10, scale = 2, nullable = false)
    protected BigDecimal cantidad;
}
