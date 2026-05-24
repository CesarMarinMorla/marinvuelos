package com.itu.MarinVuelos.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;

@Entity
@Table(name = "vuelo")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Vuelo extends Base {

    /*
    No Cascade para Avion, quiero que tengan ciclo de vida independiente
     */
    @OneToOne(mappedBy = "vuelo")
    private Avion avion;

    @OneToMany(mappedBy = "vuelo")
    private ArrayList<Aeropuerto> aeropuertos;

    /*
    Para no duplicar Aerolinea constantemente en la BD
    usaré ManyToOne
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aerolinea_id", nullable = false)
    private Aerolinea aerolinea;

    @OneToMany(mappedBy = "vuelo")
    private ArrayList<Tarifa> tarifas;
}
