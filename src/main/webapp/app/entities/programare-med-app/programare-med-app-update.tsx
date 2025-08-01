import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getPacients } from 'app/entities/pacient-med-app/pacient-med-app.reducer';
import { getEntities as getMedics } from 'app/entities/medic-med-app/medic-med-app.reducer';
import { getEntities as getLocaties } from 'app/entities/locatie-med-app/locatie-med-app.reducer';
import { ProgramareStatus } from 'app/shared/model/enumerations/programare-status.model';
import { createEntity, getEntity, reset, updateEntity } from './programare-med-app.reducer';

export const ProgramareMedAppUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const pacients = useAppSelector(state => state.pacient.entities);
  const medics = useAppSelector(state => state.medic.entities);
  const locaties = useAppSelector(state => state.locatie.entities);
  const programareEntity = useAppSelector(state => state.programare.entity);
  const loading = useAppSelector(state => state.programare.loading);
  const updating = useAppSelector(state => state.programare.updating);
  const updateSuccess = useAppSelector(state => state.programare.updateSuccess);
  const programareStatusValues = Object.keys(ProgramareStatus);

  const handleClose = () => {
    navigate(`/programare-med-app${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getPacients({}));
    dispatch(getMedics({}));
    dispatch(getLocaties({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    if (values.id !== undefined && typeof values.id !== 'number') {
      values.id = Number(values.id);
    }
    values.dataProgramare = convertDateTimeToServer(values.dataProgramare);

    const entity = {
      ...programareEntity,
      ...values,
      pacient: pacients.find(it => it.id.toString() === values.pacient?.toString()),
      medic: medics.find(it => it.id.toString() === values.medic?.toString()),
      locatie: locaties.find(it => it.id.toString() === values.locatie?.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {
          dataProgramare: displayDefaultDateTime(),
        }
      : {
          status: 'ACTIVA',
          ...programareEntity,
          dataProgramare: convertDateTimeFromServer(programareEntity.dataProgramare),
          pacient: programareEntity?.pacient?.id,
          medic: programareEntity?.medic?.id,
          locatie: programareEntity?.locatie?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="medicalsystemApp.programare.home.createOrEditLabel" data-cy="ProgramareCreateUpdateHeading">
            <Translate contentKey="medicalsystemApp.programare.home.createOrEditLabel">Create or edit a Programare</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? (
                <ValidatedField
                  name="id"
                  required
                  readOnly
                  id="programare-med-app-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('medicalsystemApp.programare.dataProgramare')}
                id="programare-med-app-dataProgramare"
                name="dataProgramare"
                data-cy="dataProgramare"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                label={translate('medicalsystemApp.programare.status')}
                id="programare-med-app-status"
                name="status"
                data-cy="status"
                type="select"
              >
                {programareStatusValues.map(programareStatus => (
                  <option value={programareStatus} key={programareStatus}>
                    {translate(`medicalsystemApp.ProgramareStatus.${programareStatus}`)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label={translate('medicalsystemApp.programare.observatii')}
                id="programare-med-app-observatii"
                name="observatii"
                data-cy="observatii"
                type="text"
              />
              <ValidatedField
                id="programare-med-app-pacient"
                name="pacient"
                data-cy="pacient"
                label={translate('medicalsystemApp.programare.pacient')}
                type="select"
              >
                <option value="" key="0" />
                {pacients
                  ? pacients.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                id="programare-med-app-medic"
                name="medic"
                data-cy="medic"
                label={translate('medicalsystemApp.programare.medic')}
                type="select"
              >
                <option value="" key="0" />
                {medics
                  ? medics.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                id="programare-med-app-locatie"
                name="locatie"
                data-cy="locatie"
                label={translate('medicalsystemApp.programare.locatie')}
                type="select"
              >
                <option value="" key="0" />
                {locaties
                  ? locaties.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/programare-med-app" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ProgramareMedAppUpdate;
