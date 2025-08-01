package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.Clinica;
import com.mycompany.myapp.domain.Locatie;
import com.mycompany.myapp.service.dto.ClinicaDTO;
import com.mycompany.myapp.service.dto.LocatieDTO;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Locatie} and its DTO {@link LocatieDTO}.
 */
@Mapper(componentModel = "spring")
public interface LocatieMapper extends EntityMapper<LocatieDTO, Locatie> {
    @Mapping(target = "clinicis", source = "clinicis", qualifiedByName = "clinicaIdSet")
    LocatieDTO toDto(Locatie s);

    @Mapping(target = "clinicis", ignore = true)
    @Mapping(target = "removeClinici", ignore = true)
    Locatie toEntity(LocatieDTO locatieDTO);

    @Named("clinicaId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ClinicaDTO toDtoClinicaId(Clinica clinica);

    @Named("clinicaIdSet")
    default Set<ClinicaDTO> toDtoClinicaIdSet(Set<Clinica> clinica) {
        return clinica.stream().map(this::toDtoClinicaId).collect(Collectors.toSet());
    }
}
