package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.ClinicaTestSamples.*;
import static com.mycompany.myapp.domain.LocatieTestSamples.*;
import static com.mycompany.myapp.domain.ProgramTestSamples.*;
import static com.mycompany.myapp.domain.ProgramareTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class LocatieTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Locatie.class);
        Locatie locatie1 = getLocatieSample1();
        Locatie locatie2 = new Locatie();
        assertThat(locatie1).isNotEqualTo(locatie2);

        locatie2.setId(locatie1.getId());
        assertThat(locatie1).isEqualTo(locatie2);

        locatie2 = getLocatieSample2();
        assertThat(locatie1).isNotEqualTo(locatie2);
    }

    @Test
    void programTest() {
        Locatie locatie = getLocatieRandomSampleGenerator();
        Program programBack = getProgramRandomSampleGenerator();

        locatie.addProgram(programBack);
        assertThat(locatie.getPrograms()).containsOnly(programBack);
        assertThat(programBack.getLocatie()).isEqualTo(locatie);

        locatie.removeProgram(programBack);
        assertThat(locatie.getPrograms()).doesNotContain(programBack);
        assertThat(programBack.getLocatie()).isNull();

        locatie.programs(new HashSet<>(Set.of(programBack)));
        assertThat(locatie.getPrograms()).containsOnly(programBack);
        assertThat(programBack.getLocatie()).isEqualTo(locatie);

        locatie.setPrograms(new HashSet<>());
        assertThat(locatie.getPrograms()).doesNotContain(programBack);
        assertThat(programBack.getLocatie()).isNull();
    }

    @Test
    void programareTest() {
        Locatie locatie = getLocatieRandomSampleGenerator();
        Programare programareBack = getProgramareRandomSampleGenerator();

        locatie.addProgramare(programareBack);
        assertThat(locatie.getProgramares()).containsOnly(programareBack);
        assertThat(programareBack.getLocatie()).isEqualTo(locatie);

        locatie.removeProgramare(programareBack);
        assertThat(locatie.getProgramares()).doesNotContain(programareBack);
        assertThat(programareBack.getLocatie()).isNull();

        locatie.programares(new HashSet<>(Set.of(programareBack)));
        assertThat(locatie.getProgramares()).containsOnly(programareBack);
        assertThat(programareBack.getLocatie()).isEqualTo(locatie);

        locatie.setProgramares(new HashSet<>());
        assertThat(locatie.getProgramares()).doesNotContain(programareBack);
        assertThat(programareBack.getLocatie()).isNull();
    }

    @Test
    void cliniciTest() {
        Locatie locatie = getLocatieRandomSampleGenerator();
        Clinica clinicaBack = getClinicaRandomSampleGenerator();

        locatie.addClinici(clinicaBack);
        assertThat(locatie.getClinicis()).containsOnly(clinicaBack);
        assertThat(clinicaBack.getLocatiis()).containsOnly(locatie);

        locatie.removeClinici(clinicaBack);
        assertThat(locatie.getClinicis()).doesNotContain(clinicaBack);
        assertThat(clinicaBack.getLocatiis()).doesNotContain(locatie);

        locatie.clinicis(new HashSet<>(Set.of(clinicaBack)));
        assertThat(locatie.getClinicis()).containsOnly(clinicaBack);
        assertThat(clinicaBack.getLocatiis()).containsOnly(locatie);

        locatie.setClinicis(new HashSet<>());
        assertThat(locatie.getClinicis()).doesNotContain(clinicaBack);
        assertThat(clinicaBack.getLocatiis()).doesNotContain(locatie);
    }
}
