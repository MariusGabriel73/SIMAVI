import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getClinicas } from 'app/entities/clinica-med-app/clinica-med-app.reducer';
import { createEntity, getEntity, reset, updateEntity } from './locatie-med-app.reducer';

export const LocatieMedAppUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const clinicas = useAppSelector(state => state.clinica.entities);
  const locatieEntity = useAppSelector(state => state.locatie.entity);
  const loading = useAppSelector(state => state.locatie.loading);
  const updating = useAppSelector(state => state.locatie.updating);
  const updateSuccess = useAppSelector(state => state.locatie.updateSuccess);

  const handleClose = () => {
    navigate(`/locatie-med-app${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getClinicas({}));
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

    const entity = {
      ...locatieEntity,
      ...values,
      clinicis: mapIdList(values.clinicis),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          ...locatieEntity,
          clinicis: locatieEntity?.clinicis?.map(e => e.id.toString()),
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="medicalsystemApp.locatie.home.createOrEditLabel" data-cy="LocatieCreateUpdateHeading">
            <Translate contentKey="medicalsystemApp.locatie.home.createOrEditLabel">Create or edit a Locatie</Translate>
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
                  id="locatie-med-app-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('medicalsystemApp.locatie.oras')}
                id="locatie-med-app-oras"
                name="oras"
                data-cy="oras"
                type="text"
              />
              <ValidatedField
                label={translate('medicalsystemApp.locatie.adresa')}
                id="locatie-med-app-adresa"
                name="adresa"
                data-cy="adresa"
                type="text"
              />
              <ValidatedField
                label={translate('medicalsystemApp.locatie.codPostal')}
                id="locatie-med-app-codPostal"
                name="codPostal"
                data-cy="codPostal"
                type="text"
              />
              <ValidatedField
                label={translate('medicalsystemApp.locatie.clinici')}
                id="locatie-med-app-clinici"
                data-cy="clinici"
                type="select"
                multiple
                name="clinicis"
              >
                <option value="" key="0" />
                {clinicas
                  ? clinicas.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/locatie-med-app" replace color="info">
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

export default LocatieMedAppUpdate;
