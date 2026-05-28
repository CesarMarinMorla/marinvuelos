package com.itu.MarinVuelos.entities.actores;

import com.itu.MarinVuelos.entities.Base;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/** Superclase mapeada con los datos comunes de cualquier persona en el sistema */
@MappedSuperclass
@Getter
@Setter
public abstract class Persona extends Base {

    @NotBlank(message = "DNI requerido")
    @Column(name = "dni")
    protected String dni;

    @NotBlank(message = "Nombre requerido")
    @Column(name = "nombre_persona")
    protected String nombrePersona;

    @NotBlank(message = "Apellido requerido")
    @Column(name = "apell_persona")
    protected String apellidoPersona;


}
