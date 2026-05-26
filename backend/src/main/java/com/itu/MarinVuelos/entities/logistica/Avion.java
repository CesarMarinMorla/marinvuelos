package com.itu.MarinVuelos.entities.logistica;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.itu.MarinVuelos.entities.Base;
import com.itu.MarinVuelos.entities.enums.TipoAvion;
import com.itu.MarinVuelos.entities.enums.TipoTurbina;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.ArrayList;

@Entity
@Table(name = "avion")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Avion extends Base {

    @Column(name = "marca")
    private String marca;

    @Column(name = "modelo")
    private String modelo;

    @Column(name = "tipo_avion")
    @Enumerated(EnumType.STRING)
    private TipoAvion tipoAvion;

    @Column(name = "tipo_turbina")
    @Enumerated(EnumType.STRING)
    private TipoTurbina tipoTurbina;
}
