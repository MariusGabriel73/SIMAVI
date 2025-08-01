package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.Locatie;
import com.mycompany.myapp.domain.Medic;
import com.mycompany.myapp.domain.Pacient;
import com.mycompany.myapp.domain.Programare;
import com.mycompany.myapp.service.dto.LocatieDTO;
import com.mycompany.myapp.service.dto.MedicDTO;
import com.mycompany.myapp.service.dto.PacientDTO;
import com.mycompany.myapp.service.dto.ProgramareDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Programare} and its DTO {@link ProgramareDTO}.
 */
@Mapper(componentModel = "spring")
public interface ProgramareMapper extends EntityMapper<ProgramareDTO, Programare> {
    @Mapping(target = "pacient", source = "pacient", qualifiedByName = "pacientId")
    @Mapping(target = "medic", source = "medic", qualifiedByName = "medicId")
    @Mapping(target = "locatie", source = "locatie", qualifiedByName = "locatieId")
    ProgramareDTO toDto(Programare s);

    @Named("pacientId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    PacientDTO toDtoPacientId(Pacient pacient);

    @Named("medicId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    MedicDTO toDtoMedicId(Medic medic);

    @Named("locatieId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    LocatieDTO toDtoLocatieId(Locatie locatie);
}
