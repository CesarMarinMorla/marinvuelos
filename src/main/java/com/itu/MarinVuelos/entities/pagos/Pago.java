package com.itu.MarinVuelos.entities.pagos;

import com.itu.MarinVuelos.entities.Base;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@MappedSuperclass
@Getter
@Setter
public abstract class Pago extends Base {

    @NotNull
    @Column(name = "cantidad",  precision = 10, scale = 2, nullable = false)
    protected BigDecimal cantidad;
}
