package com.itu.MarinVuelos.entities.actores;

import com.itu.MarinVuelos.entities.Base;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

@MappedSuperclass
@Getter
@Setter
public abstract class Persona extends Base {

    @Column(name = "dni")
    protected String dni;

    @Column(name = "nombre_persona")
    protected String nombrePersona;

    @Column(name = "apell_persona")
    protected String apellidoPersona;


}
