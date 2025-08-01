package com.mycompany.myapp.service;

import com.mycompany.myapp.service.dto.ClinicaDTO;
import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Interface for managing {@link com.mycompany.myapp.domain.Clinica}.
 */
public interface ClinicaService {
    /**
     * Save a clinica.
     *
     * @param clinicaDTO the entity to save.
     * @return the persisted entity.
     */
    Mono<ClinicaDTO> save(ClinicaDTO clinicaDTO);

    /**
     * Updates a clinica.
     *
     * @param clinicaDTO the entity to update.
     * @return the persisted entity.
     */
    Mono<ClinicaDTO> update(ClinicaDTO clinicaDTO);

    /**
     * Partially updates a clinica.
     *
     * @param clinicaDTO the entity to update partially.
     * @return the persisted entity.
     */
    Mono<ClinicaDTO> partialUpdate(ClinicaDTO clinicaDTO);

    /**
     * Get all the clinicas.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Flux<ClinicaDTO> findAll(Pageable pageable);

    /**
     * Get all the clinicas with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Flux<ClinicaDTO> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Returns the number of clinicas available.
     * @return the number of entities in the database.
     *
     */
    Mono<Long> countAll();

    /**
     * Get the "id" clinica.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Mono<ClinicaDTO> findOne(Long id);

    /**
     * Delete the "id" clinica.
     *
     * @param id the id of the entity.
     * @return a Mono to signal the deletion
     */
    Mono<Void> delete(Long id);
}
