package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.Clinica;
import com.mycompany.myapp.domain.Medic;
import com.mycompany.myapp.domain.Specializare;
import com.mycompany.myapp.domain.User;
import com.mycompany.myapp.service.dto.ClinicaDTO;
import com.mycompany.myapp.service.dto.MedicDTO;
import com.mycompany.myapp.service.dto.SpecializareDTO;
import com.mycompany.myapp.service.dto.UserDTO;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Medic} and its DTO {@link MedicDTO}.
 */
@Mapper(componentModel = "spring")
public interface MedicMapper extends EntityMapper<MedicDTO, Medic> {
    @Mapping(target = "user", source = "user", qualifiedByName = "userId")
    @Mapping(target = "specializaris", source = "specializaris", qualifiedByName = "specializareIdSet")
    @Mapping(target = "clinicis", source = "clinicis", qualifiedByName = "clinicaIdSet")
    MedicDTO toDto(Medic s);

    @Mapping(target = "removeSpecializari", ignore = true)
    @Mapping(target = "removeClinici", ignore = true)
    Medic toEntity(MedicDTO medicDTO);

    @Named("userId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    UserDTO toDtoUserId(User user);

    @Named("specializareId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    SpecializareDTO toDtoSpecializareId(Specializare specializare);

    @Named("specializareIdSet")
    default Set<SpecializareDTO> toDtoSpecializareIdSet(Set<Specializare> specializare) {
        return specializare.stream().map(this::toDtoSpecializareId).collect(Collectors.toSet());
    }

    @Named("clinicaId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ClinicaDTO toDtoClinicaId(Clinica clinica);

    @Named("clinicaIdSet")
    default Set<ClinicaDTO> toDtoClinicaIdSet(Set<Clinica> clinica) {
        return clinica.stream().map(this::toDtoClinicaId).collect(Collectors.toSet());
    }
}
