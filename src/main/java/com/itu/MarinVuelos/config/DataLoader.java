package com.itu.MarinVuelos.config;

import com.itu.MarinVuelos.entities.actores.Piloto;
import com.itu.MarinVuelos.entities.enums.TipoAvion;
import com.itu.MarinVuelos.entities.enums.TipoTurbina;
import com.itu.MarinVuelos.entities.logistica.*;
import com.itu.MarinVuelos.repositories.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final CiudadRepository ciudadRepository;
    private final AeropuertoRepository aeropuertoRepository;
    private final AerolineaRepository aerolineaRepository;
    private final AvionRepository avionRepository;
    private final PilotoRepository pilotoRepository;

    public DataLoader(CiudadRepository ciudadRepository,
                      AeropuertoRepository aeropuertoRepository,
                      AerolineaRepository aerolineaRepository,
                      AvionRepository avionRepository,
                      PilotoRepository pilotoRepository) {
        this.ciudadRepository = ciudadRepository;
        this.aeropuertoRepository = aeropuertoRepository;
        this.aerolineaRepository = aerolineaRepository;
        this.avionRepository = avionRepository;
        this.pilotoRepository = pilotoRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (ciudadRepository.count() > 0) {
            return;
        }

        // Crear ciudades
        Ciudad buenosAires = new Ciudad();
        buenosAires.setNombreCiudad("Buenos Aires");
        buenosAires = ciudadRepository.save(buenosAires);

        Ciudad madrid = new Ciudad();
        madrid.setNombreCiudad("Madrid");
        madrid = ciudadRepository.save(madrid);

        Ciudad miami = new Ciudad();
        miami.setNombreCiudad("Miami");
        miami = ciudadRepository.save(miami);

        Ciudad mexicoCity = new Ciudad();
        mexicoCity.setNombreCiudad("Mexico City");
        mexicoCity = ciudadRepository.save(mexicoCity);

        // Crear aeropuertos
        Aeropuerto ministerioPistarini = new Aeropuerto();
        ministerioPistarini.setNombreAeropuerto("Ministro Pistarini");
        ministerioPistarini.setCiudad(buenosAires);
        aeropuertoRepository.save(ministerioPistarini);

        Aeropuerto adolfoSuarez = new Aeropuerto();
        adolfoSuarez.setNombreAeropuerto("Adolfo Suárez");
        adolfoSuarez.setCiudad(madrid);
        aeropuertoRepository.save(adolfoSuarez);

        Aeropuerto miamiInt = new Aeropuerto();
        miamiInt.setNombreAeropuerto("Miami International");
        miamiInt.setCiudad(miami);
        aeropuertoRepository.save(miamiInt);

        Aeropuerto benitoBenito = new Aeropuerto();
        benitoBenito.setNombreAeropuerto("Benito Juárez");
        benitoBenito.setCiudad(mexicoCity);
        aeropuertoRepository.save(benitoBenito);

        // Crear aerolíneas
        Aerolinea aerolineas = new Aerolinea();
        aerolineas.setNombreAerolinea("Aerolineas Argentinas");
        aerolineaRepository.save(aerolineas);

        Aerolinea iberia = new Aerolinea();
        iberia.setNombreAerolinea("Iberia");
        aerolineaRepository.save(iberia);

        Aerolinea latam = new Aerolinea();
        latam.setNombreAerolinea("LATAM Airlines");
        aerolineaRepository.save(latam);

        Aerolinea viva = new Aerolinea();
        viva.setNombreAerolinea("Viva Aerobus");
        aerolineaRepository.save(viva);

        // Crear aviones
        Avion boeing737 = new Avion();
        boeing737.setMarca("Boeing");
        boeing737.setModelo("737");
        boeing737.setTipoAvion(TipoAvion.NARROW_BODY);
        boeing737.setTipoTurbina(TipoTurbina.TURBOFAN);
        avionRepository.save(boeing737);

        Avion airbus = new Avion();
        airbus.setMarca("Airbus");
        airbus.setModelo("A320");
        airbus.setTipoAvion(TipoAvion.NARROW_BODY);
        airbus.setTipoTurbina(TipoTurbina.TURBOFAN);
        avionRepository.save(airbus);

        Avion bombardier = new Avion();
        bombardier.setMarca("Bombardier");
        bombardier.setModelo("CRJ");
        bombardier.setTipoAvion(TipoAvion.REGIONAL);
        bombardier.setTipoTurbina(TipoTurbina.TURBOFAN);
        avionRepository.save(bombardier);

        // Crear pilotos
        Piloto juan = new Piloto();
        juan.setDni("12345678");
        juan.setNombrePersona("Juan");
        juan.setApellidoPersona("Pérez");
        juan.setLicencia("LIC-001");
        pilotoRepository.save(juan);

        Piloto maria = new Piloto();
        maria.setDni("87654321");
        maria.setNombrePersona("María");
        maria.setApellidoPersona("García");
        maria.setLicencia("LIC-002");
        pilotoRepository.save(maria);

        Piloto carlos = new Piloto();
        carlos.setDni("11223344");
        carlos.setNombrePersona("Carlos");
        carlos.setApellidoPersona("López");
        carlos.setLicencia("LIC-003");
        pilotoRepository.save(carlos);
    }
}
