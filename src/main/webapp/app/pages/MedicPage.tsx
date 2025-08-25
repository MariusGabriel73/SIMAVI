import React, { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import {
  Clinica,
  Locatie,
  Program,
  Programare,
  ProgramareStatus,
  getClinici,
  getLocatiiByClinica,
  getPrograms,
  getAppointmentsForMedicOnDate,
  cancelAppointment,
  updateAppointment,
  getMedici, // <-- avem nevoie de lista de medici
  type Medic, // <-- tipul Medic pentru dropdown
  type ID,
} from 'app/shared/api/pacient-api';
import { useAppSelector } from 'app/config/store';

function toDayRangeISO(dateStr: string) {
  const start = dayjs(dateStr).startOf('day');
  const end = start.add(1, 'day');
  return { startIso: start.toISOString(), endIso: end.toISOString() };
}

export default function MedicPage() {
  const account = useAppSelector(state => state.authentication.account);
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const isAdmin = !!account?.authorities?.includes('ROLE_ADMIN');

  const [loading, setLoading] = useState(false);

  const [clinici, setClinici] = useState<Clinica[]>([]);
  const [locatii, setLocatii] = useState<Locatie[]>([]);
  const [medici, setMedici] = useState<Medic[]>([]); // <-- lista de medici pt admin
  const [programs, setPrograms] = useState<Program[]>([]);
  const [appointments, setAppointments] = useState<Programare[]>([]);

  const [clinicaId, setClinicaId] = useState<ID | undefined>(undefined);
  const [locatieId, setLocatieId] = useState<ID | undefined>(undefined);
  const [medicId, setMedicId] = useState<ID | undefined>(undefined); // <-- selectat de admin

  const [selectedDate, setSelectedDate] = useState<string>(dayjs().format('YYYY-MM-DD'));

  const hasFinalizata = useMemo(() => Object.prototype.hasOwnProperty.call(ProgramareStatus, 'FINALIZATA'), []);

  // --- încărcări ---

  // clinici
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const c = await getClinici();
        setClinici(c);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // locații după clinică
  useEffect(() => {
    (async () => {
      if (!clinicaId) {
        setLocatii([]);
        setLocatieId(undefined);
        setMedici([]); // reset și lista de medici
        setMedicId(undefined);
        return;
      }
      setLoading(true);
      try {
        const l = await getLocatiiByClinica(clinicaId);
        setLocatii(l);

        // pentru admin: după alegerea clinicii, încarcă medicii din clinică (sau toți dacă API-ul tău ignoră filtru)
        if (isAdmin) {
          const m = await getMedici({ clinicaId });
          setMedici(m);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [clinicaId, isAdmin]);

  // program medic+locație
  useEffect(() => {
    (async () => {
      if (!medicId || !locatieId) {
        setPrograms([]);
        return;
      }
      setLoading(true);
      try {
        const p = await getPrograms(medicId, locatieId);
        setPrograms(p);
      } finally {
        setLoading(false);
      }
    })();
  }, [medicId, locatieId]);

  // programări pe zi (medic+locație+dată)
  const loadAppointments = useCallback(async () => {
    if (!selectedDate || !medicId || !locatieId) {
      setAppointments([]);
      return;
    }
    const { startIso, endIso } = toDayRangeISO(selectedDate);
    setLoading(true);
    try {
      const items = await getAppointmentsForMedicOnDate(medicId, locatieId, startIso, endIso);
      items.sort((a, b) => (a.dataProgramare < b.dataProgramare ? -1 : 1));
      setAppointments(items);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, medicId, locatieId]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  // --- acțiuni ---

  async function markFinalizata(a: Programare) {
    if (!a.id) return;
    setLoading(true);
    try {
      if (hasFinalizata) {
        await updateAppointment(a.id, { status: ProgramareStatus.FINALIZATA as any });
      }
      await loadAppointments();
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(a: Programare) {
    if (!a.id) return;
    setLoading(true);
    try {
      await cancelAppointment(a.id);
      await loadAppointments();
    } finally {
      setLoading(false);
    }
  }

  // --- UI ---

  return (
    <div className="container py-4">
      <h2 className="mb-4">Agenda medicului</h2>

      {!isAuthenticated && <div className="alert alert-warning">Trebuie să fii autentificat pentru a accesa această pagină.</div>}

      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Clinică</label>
              <select
                className="form-select"
                value={clinicaId ?? ''}
                onChange={e => {
                  const val = e.target.value ? Number(e.target.value) : undefined;
                  setClinicaId(val);
                  // reset dependent
                  setLocatieId(undefined);
                  setMedicId(undefined);
                  setPrograms([]);
                  setAppointments([]);
                }}
              >
                <option value="">— alege clinica —</option>
                {clinici.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.nume}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Locație</label>
              <select
                className="form-select"
                value={locatieId ?? ''}
                onChange={e => {
                  const val = e.target.value ? Number(e.target.value) : undefined;
                  setLocatieId(val);
                  setPrograms([]);
                  setAppointments([]);
                }}
                disabled={!clinicaId}
              >
                <option value="">— alege locația —</option>
                {locatii.map(l => (
                  <option key={l.id} value={l.id}>
                    {l.oras ? `${l.oras} — ` : ''}
                    {l.adresa ?? `Locația #${l.id}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Selector de MEDIC numai pentru ADMIN (pentru medici reali îl poți ascunde și seta automat medicId-ul curent) */}
            {isAdmin && (
              <div className="col-md-4">
                <label className="form-label">Medic</label>
                <select
                  className="form-select"
                  value={medicId ?? ''}
                  onChange={e => {
                    const val = e.target.value ? Number(e.target.value) : undefined;
                    setMedicId(val);
                    setPrograms([]);
                    setAppointments([]);
                  }}
                  disabled={!clinicaId}
                >
                  <option value="">— alege medicul —</option>
                  {medici.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.gradProfesional ? `${m.gradProfesional} ` : ''}Medicul #{m.id}
                      {m.disponibil === false ? ' (indisponibil)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="col-md-4">
              <label className="form-label">Data</label>
              <input
                type="date"
                className="form-control"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                disabled={!locatieId || (!medicId && isAdmin)}
                min={dayjs().format('YYYY-MM-DD')}
              />
            </div>
          </div>
        </div>
      </div>

      {programs.length > 0 && (
        <div className="card mb-4">
          <div className="card-header">Programul zilei</div>
          <div className="card-body">
            <ul className="mb-0">
              {programs.map(p => (
                <li key={p.id ?? `${p.ziuaSaptamanii}-${p.oraStart}-${p.oraFinal}`}>
                  {p.ziuaSaptamanii}: {dayjs(p.oraStart).format('HH:mm')} – {dayjs(p.oraFinal).format('HH:mm')}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <h3 className="mb-3">Programări ({dayjs(selectedDate).format('YYYY-MM-DD')})</h3>
      <div className="card">
        <div className="card-body">
          {!locatieId || (!medicId && isAdmin) ? (
            <div className="text-muted">Selectează clinica, locația {isAdmin ? 'și medicul' : ''} pentru a vedea agenda.</div>
          ) : appointments.length === 0 ? (
            <div className="text-muted">Nu există programări pentru ziua selectată.</div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Ora</th>
                    <th>Pacient</th>
                    <th>Observații</th>
                    <th>Status</th>
                    <th style={{ width: 260 }}>Acțiuni</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(a => {
                    const d = dayjs(a.dataProgramare);
                    return (
                      <tr key={a.id}>
                        <td>{d.format('HH:mm')}</td>
                        <td>{a.pacientId ? `#${a.pacientId}` : '-'}</td>
                        <td className="text-truncate" style={{ maxWidth: 280 }} title={a.observatii || ''}>
                          {a.observatii || <span className="text-muted">—</span>}
                        </td>
                        <td>
                          <span
                            className={
                              a.status === ProgramareStatus.ACTIVA
                                ? 'badge bg-success'
                                : a.status === ProgramareStatus.ANULATA
                                  ? 'badge bg-secondary'
                                  : 'badge bg-info'
                            }
                          >
                            {a.status}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex flex-wrap gap-2">
                            {hasFinalizata && a.status === ProgramareStatus.ACTIVA && (
                              <button type="button" className="btn btn-outline-success btn-sm" onClick={() => markFinalizata(a)}>
                                Marchează finalizată
                              </button>
                            )}
                            {a.status === ProgramareStatus.ACTIVA && (
                              <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleCancel(a)}>
                                Anulează
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1080 }}>
          <div className="toast show align-items-center text-bg-dark border-0">
            <div className="d-flex">
              <div className="toast-body">Se încarcă...</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
