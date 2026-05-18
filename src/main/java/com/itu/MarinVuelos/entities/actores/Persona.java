package com.itu.MarinVuelos.entities.actores;

import com.itu.MarinVuelos.entities.Base;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

@MappedSuperclass
@Getter
@Setter
public abstract class Persona extends Base {

    protected String dni;
    protected String nombrePersona;
    protected String apellidoPersona;


}
