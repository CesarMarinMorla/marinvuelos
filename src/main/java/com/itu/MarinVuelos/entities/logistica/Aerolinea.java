package com.itu.MarinVuelos.entities.logistica;

import com.itu.MarinVuelos.entities.Base;
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

    /*
    Para sacar lista completa de vuelos

    En caso de eliminar una aerolinea:
    Si aqui se usa Cascade estariamos borrando no solo las aerolineas
    sino todos los vuelos existentes, mucho cuidado
    */
    @OneToMany(mappedBy = "aerolinea")
    private ArrayList<Vuelo> vuelo;
}
