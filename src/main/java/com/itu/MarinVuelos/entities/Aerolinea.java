package com.itu.MarinVuelos.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.ArrayList;

@Entity
@Table(name = "aerolinea")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Aerolinea extends Base {

    @Column(name = "nombre_aerolinea")
    private String nombreAerolinea;

    // Para sacar lista completa de vuelos
    @OneToMany(mappedBy = "aerolinea")
    private ArrayList<Vuelo> vuelo;
}
