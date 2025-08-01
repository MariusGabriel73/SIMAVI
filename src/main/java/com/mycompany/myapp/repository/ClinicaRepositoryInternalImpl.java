package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Clinica;
import com.mycompany.myapp.domain.Locatie;
import com.mycompany.myapp.repository.rowmapper.ClinicaRowMapper;
import io.r2dbc.spi.Row;
import io.r2dbc.spi.RowMetadata;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.convert.R2dbcConverter;
import org.springframework.data.r2dbc.core.R2dbcEntityOperations;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import org.springframework.data.r2dbc.repository.support.SimpleR2dbcRepository;
import org.springframework.data.relational.core.sql.Comparison;
import org.springframework.data.relational.core.sql.Condition;
import org.springframework.data.relational.core.sql.Conditions;
import org.springframework.data.relational.core.sql.Expression;
import org.springframework.data.relational.core.sql.Select;
import org.springframework.data.relational.core.sql.SelectBuilder.SelectFromAndJoin;
import org.springframework.data.relational.core.sql.Table;
import org.springframework.data.relational.repository.support.MappingRelationalEntityInformation;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.r2dbc.core.RowsFetchSpec;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC custom repository implementation for the Clinica entity.
 */
@SuppressWarnings("unused")
class ClinicaRepositoryInternalImpl extends SimpleR2dbcRepository<Clinica, Long> implements ClinicaRepositoryInternal {

    private final DatabaseClient db;
    private final R2dbcEntityTemplate r2dbcEntityTemplate;
    private final EntityManager entityManager;

    private final ClinicaRowMapper clinicaMapper;

    private static final Table entityTable = Table.aliased("clinica", EntityManager.ENTITY_ALIAS);

    private static final EntityManager.LinkTable locatiiLink = new EntityManager.LinkTable(
        "rel_clinica__locatii",
        "clinica_id",
        "locatii_id"
    );

    public ClinicaRepositoryInternalImpl(
        R2dbcEntityTemplate template,
        EntityManager entityManager,
        ClinicaRowMapper clinicaMapper,
        R2dbcEntityOperations entityOperations,
        R2dbcConverter converter
    ) {
        super(
            new MappingRelationalEntityInformation(converter.getMappingContext().getRequiredPersistentEntity(Clinica.class)),
            entityOperations,
            converter
        );
        this.db = template.getDatabaseClient();
        this.r2dbcEntityTemplate = template;
        this.entityManager = entityManager;
        this.clinicaMapper = clinicaMapper;
    }

    @Override
    public Flux<Clinica> findAllBy(Pageable pageable) {
        return createQuery(pageable, null).all();
    }

    RowsFetchSpec<Clinica> createQuery(Pageable pageable, Condition whereClause) {
        List<Expression> columns = ClinicaSqlHelper.getColumns(entityTable, EntityManager.ENTITY_ALIAS);
        SelectFromAndJoin selectFrom = Select.builder().select(columns).from(entityTable);
        // we do not support Criteria here for now as of https://github.com/jhipster/generator-jhipster/issues/18269
        String select = entityManager.createSelect(selectFrom, Clinica.class, pageable, whereClause);
        return db.sql(select).map(this::process);
    }

    @Override
    public Flux<Clinica> findAll() {
        return findAllBy(null);
    }

    @Override
    public Mono<Clinica> findById(Long id) {
        Comparison whereClause = Conditions.isEqual(entityTable.column("id"), Conditions.just(id.toString()));
        return createQuery(null, whereClause).one();
    }

    @Override
    public Mono<Clinica> findOneWithEagerRelationships(Long id) {
        return findById(id);
    }

    @Override
    public Flux<Clinica> findAllWithEagerRelationships() {
        return findAll();
    }

    @Override
    public Flux<Clinica> findAllWithEagerRelationships(Pageable page) {
        return findAllBy(page);
    }

    private Clinica process(Row row, RowMetadata metadata) {
        Clinica entity = clinicaMapper.apply(row, "e");
        return entity;
    }

    @Override
    public <S extends Clinica> Mono<S> save(S entity) {
        return super.save(entity).flatMap((S e) -> updateRelations(e));
    }

    protected <S extends Clinica> Mono<S> updateRelations(S entity) {
        Mono<Void> result = entityManager
            .updateLinkTable(locatiiLink, entity.getId(), entity.getLocatiis().stream().map(Locatie::getId))
            .then();
        return result.thenReturn(entity);
    }

    @Override
    public Mono<Void> deleteById(Long entityId) {
        return deleteRelations(entityId).then(super.deleteById(entityId));
    }

    protected Mono<Void> deleteRelations(Long entityId) {
        return entityManager.deleteFromLinkTable(locatiiLink, entityId);
    }
}
