package com.itu.MarinVuelos.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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


}
