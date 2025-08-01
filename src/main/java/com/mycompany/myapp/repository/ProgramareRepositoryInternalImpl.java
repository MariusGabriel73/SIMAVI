package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Programare;
import com.mycompany.myapp.repository.rowmapper.LocatieRowMapper;
import com.mycompany.myapp.repository.rowmapper.MedicRowMapper;
import com.mycompany.myapp.repository.rowmapper.PacientRowMapper;
import com.mycompany.myapp.repository.rowmapper.ProgramareRowMapper;
import io.r2dbc.spi.Row;
import io.r2dbc.spi.RowMetadata;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.convert.R2dbcConverter;
import org.springframework.data.r2dbc.core.R2dbcEntityOperations;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import org.springframework.data.r2dbc.repository.support.SimpleR2dbcRepository;
import org.springframework.data.relational.core.sql.Column;
import org.springframework.data.relational.core.sql.Comparison;
import org.springframework.data.relational.core.sql.Condition;
import org.springframework.data.relational.core.sql.Conditions;
import org.springframework.data.relational.core.sql.Expression;
import org.springframework.data.relational.core.sql.Select;
import org.springframework.data.relational.core.sql.SelectBuilder.SelectFromAndJoinCondition;
import org.springframework.data.relational.core.sql.Table;
import org.springframework.data.relational.repository.support.MappingRelationalEntityInformation;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.r2dbc.core.RowsFetchSpec;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC custom repository implementation for the Programare entity.
 */
@SuppressWarnings("unused")
class ProgramareRepositoryInternalImpl extends SimpleR2dbcRepository<Programare, Long> implements ProgramareRepositoryInternal {

    private final DatabaseClient db;
    private final R2dbcEntityTemplate r2dbcEntityTemplate;
    private final EntityManager entityManager;

    private final PacientRowMapper pacientMapper;
    private final MedicRowMapper medicMapper;
    private final LocatieRowMapper locatieMapper;
    private final ProgramareRowMapper programareMapper;

    private static final Table entityTable = Table.aliased("programare", EntityManager.ENTITY_ALIAS);
    private static final Table pacientTable = Table.aliased("pacient", "pacient");
    private static final Table medicTable = Table.aliased("medic", "medic");
    private static final Table locatieTable = Table.aliased("locatie", "locatie");

    public ProgramareRepositoryInternalImpl(
        R2dbcEntityTemplate template,
        EntityManager entityManager,
        PacientRowMapper pacientMapper,
        MedicRowMapper medicMapper,
        LocatieRowMapper locatieMapper,
        ProgramareRowMapper programareMapper,
        R2dbcEntityOperations entityOperations,
        R2dbcConverter converter
    ) {
        super(
            new MappingRelationalEntityInformation(converter.getMappingContext().getRequiredPersistentEntity(Programare.class)),
            entityOperations,
            converter
        );
        this.db = template.getDatabaseClient();
        this.r2dbcEntityTemplate = template;
        this.entityManager = entityManager;
        this.pacientMapper = pacientMapper;
        this.medicMapper = medicMapper;
        this.locatieMapper = locatieMapper;
        this.programareMapper = programareMapper;
    }

    @Override
    public Flux<Programare> findAllBy(Pageable pageable) {
        return createQuery(pageable, null).all();
    }

    RowsFetchSpec<Programare> createQuery(Pageable pageable, Condition whereClause) {
        List<Expression> columns = ProgramareSqlHelper.getColumns(entityTable, EntityManager.ENTITY_ALIAS);
        columns.addAll(PacientSqlHelper.getColumns(pacientTable, "pacient"));
        columns.addAll(MedicSqlHelper.getColumns(medicTable, "medic"));
        columns.addAll(LocatieSqlHelper.getColumns(locatieTable, "locatie"));
        SelectFromAndJoinCondition selectFrom = Select.builder()
            .select(columns)
            .from(entityTable)
            .leftOuterJoin(pacientTable)
            .on(Column.create("pacient_id", entityTable))
            .equals(Column.create("id", pacientTable))
            .leftOuterJoin(medicTable)
            .on(Column.create("medic_id", entityTable))
            .equals(Column.create("id", medicTable))
            .leftOuterJoin(locatieTable)
            .on(Column.create("locatie_id", entityTable))
            .equals(Column.create("id", locatieTable));
        // we do not support Criteria here for now as of https://github.com/jhipster/generator-jhipster/issues/18269
        String select = entityManager.createSelect(selectFrom, Programare.class, pageable, whereClause);
        return db.sql(select).map(this::process);
    }

    @Override
    public Flux<Programare> findAll() {
        return findAllBy(null);
    }

    @Override
    public Mono<Programare> findById(Long id) {
        Comparison whereClause = Conditions.isEqual(entityTable.column("id"), Conditions.just(id.toString()));
        return createQuery(null, whereClause).one();
    }

    private Programare process(Row row, RowMetadata metadata) {
        Programare entity = programareMapper.apply(row, "e");
        entity.setPacient(pacientMapper.apply(row, "pacient"));
        entity.setMedic(medicMapper.apply(row, "medic"));
        entity.setLocatie(locatieMapper.apply(row, "locatie"));
        return entity;
    }

    @Override
    public <S extends Programare> Mono<S> save(S entity) {
        return super.save(entity);
    }
}
