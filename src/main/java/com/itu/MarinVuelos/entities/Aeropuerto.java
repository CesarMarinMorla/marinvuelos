package com.itu.MarinVuelos.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "aeropuerto")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Aeropuerto extends Base {

    @Column(name = "nombre_aeropuerto")
    private String nombreAeropuerto;

    /*
    Referencia al ID de ciudad, evita la repeticion de la misma ciudad en la BD
     */
    @OneToOne
    @JoinColumn(name = "ciudad_id")
    private Ciudad ciudad;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vuelo_id", nullable = false)
    private Vuelo vuelo;
}
