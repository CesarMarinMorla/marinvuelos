package com.itu.MarinVuelos.entities.logistica;

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

    /*
    Modelo y marca deberían mostrarse a la hora de hacer una reserva
    */

    @Column(name = "marca")
    private String marca;

    @Column(name = "modelo")
    private String modelo;

    /*
    Decisión personal, complejidad innecesaria,
    ENUMS para tipos ya son usados en otras partes del diagrama

    Metodos de especificación cambiados por ENUM que serán precargados,
    la interface original solo retorna Strings

    Notas sobre usar interface:
    Se puede considerar usar otros métodos que requieran cálculos o
    variables únicas para aprovechar el poder real de una interface
    */

    @Column(name = "tipo_avion")
    @Enumerated(EnumType.STRING)
    private TipoAvion tipoAvion;

    @Column(name = "tipo_turbina")
    @Enumerated(EnumType.STRING)
    private TipoTurbina tipoTurbina;

    /*
    composicion en asientos
    */
    @OneToMany(mappedBy = "avion",  cascade = CascadeType.ALL, orphanRemoval = true)
    private ArrayList<Asiento> asientos;

    @OneToOne
    @JoinColumn(name = "vuelo_id")
    private Vuelo vuelo;
}
