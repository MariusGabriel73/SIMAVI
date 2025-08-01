package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

/**
 * Informații despre o clinică.
 */
@Table("clinica")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Clinica implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column("id")
    private Long id;

    @NotNull(message = "must not be null")
    @Column("nume")
    private String nume;

    @Column("telefon")
    private String telefon;

    @Column("email")
    private String email;

    @org.springframework.data.annotation.Transient
    @JsonIgnoreProperties(value = { "programs", "programares", "clinicis" }, allowSetters = true)
    private Set<Locatie> locatiis = new HashSet<>();

    @org.springframework.data.annotation.Transient
    @JsonIgnoreProperties(value = { "user", "specializaris", "clinicis", "programs", "programares" }, allowSetters = true)
    private Set<Medic> medicis = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Clinica id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNume() {
        return this.nume;
    }

    public Clinica nume(String nume) {
        this.setNume(nume);
        return this;
    }

    public void setNume(String nume) {
        this.nume = nume;
    }

    public String getTelefon() {
        return this.telefon;
    }

    public Clinica telefon(String telefon) {
        this.setTelefon(telefon);
        return this;
    }

    public void setTelefon(String telefon) {
        this.telefon = telefon;
    }

    public String getEmail() {
        return this.email;
    }

    public Clinica email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Set<Locatie> getLocatiis() {
        return this.locatiis;
    }

    public void setLocatiis(Set<Locatie> locaties) {
        this.locatiis = locaties;
    }

    public Clinica locatiis(Set<Locatie> locaties) {
        this.setLocatiis(locaties);
        return this;
    }

    public Clinica addLocatii(Locatie locatie) {
        this.locatiis.add(locatie);
        return this;
    }

    public Clinica removeLocatii(Locatie locatie) {
        this.locatiis.remove(locatie);
        return this;
    }

    public Set<Medic> getMedicis() {
        return this.medicis;
    }

    public void setMedicis(Set<Medic> medics) {
        if (this.medicis != null) {
            this.medicis.forEach(i -> i.removeClinici(this));
        }
        if (medics != null) {
            medics.forEach(i -> i.addClinici(this));
        }
        this.medicis = medics;
    }

    public Clinica medicis(Set<Medic> medics) {
        this.setMedicis(medics);
        return this;
    }

    public Clinica addMedici(Medic medic) {
        this.medicis.add(medic);
        medic.getClinicis().add(this);
        return this;
    }

    public Clinica removeMedici(Medic medic) {
        this.medicis.remove(medic);
        medic.getClinicis().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Clinica)) {
            return false;
        }
        return getId() != null && getId().equals(((Clinica) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Clinica{" +
            "id=" + getId() +
            ", nume='" + getNume() + "'" +
            ", telefon='" + getTelefon() + "'" +
            ", email='" + getEmail() + "'" +
            "}";
    }
}
