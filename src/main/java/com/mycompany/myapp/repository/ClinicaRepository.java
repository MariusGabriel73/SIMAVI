package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Clinica;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC repository for the Clinica entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ClinicaRepository extends ReactiveCrudRepository<Clinica, Long>, ClinicaRepositoryInternal {
    Flux<Clinica> findAllBy(Pageable pageable);

    @Override
    Mono<Clinica> findOneWithEagerRelationships(Long id);

    @Override
    Flux<Clinica> findAllWithEagerRelationships();

    @Override
    Flux<Clinica> findAllWithEagerRelationships(Pageable page);

    @Query(
        "SELECT entity.* FROM clinica entity JOIN rel_clinica__locatii joinTable ON entity.id = joinTable.locatii_id WHERE joinTable.locatii_id = :id"
    )
    Flux<Clinica> findByLocatii(Long id);

    @Override
    <S extends Clinica> Mono<S> save(S entity);

    @Override
    Flux<Clinica> findAll();

    @Override
    Mono<Clinica> findById(Long id);

    @Override
    Mono<Void> deleteById(Long id);
}

interface ClinicaRepositoryInternal {
    <S extends Clinica> Mono<S> save(S entity);

    Flux<Clinica> findAllBy(Pageable pageable);

    Flux<Clinica> findAll();

    Mono<Clinica> findById(Long id);
    // this is not supported at the moment because of https://github.com/jhipster/generator-jhipster/issues/18269
    // Flux<Clinica> findAllBy(Pageable pageable, Criteria criteria);

    Mono<Clinica> findOneWithEagerRelationships(Long id);

    Flux<Clinica> findAllWithEagerRelationships();

    Flux<Clinica> findAllWithEagerRelationships(Pageable page);

    Mono<Void> deleteById(Long id);
}
