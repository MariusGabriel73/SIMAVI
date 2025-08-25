import axios from 'axios';

// Folosește axios-ul global configurat de aplicație
const api = axios;

export type ID = number;

export enum ProgramareStatus {
  ACTIVA = 'ACTIVA',
  ANULATA = 'ANULATA',
  FINALIZATA = 'FINALIZATA',
}

export interface Clinica {
  id: ID;
  nume: string;
}

export interface Locatie {
  id: ID;
  oras?: string;
  adresa?: string;
  codPostal?: string;
}

export interface Specializare {
  id: ID;
  nume: string;
}

export interface Medic {
  id: ID;
  gradProfesional?: string;
  telefon?: string;
  disponibil?: boolean;
  userId?: ID;
}

export interface Program {
  id: ID;
  ziuaSaptamanii: string; // ex: MONDAY/TUESDAY sau "Luni"... conform backend
  oraStart: string; // ISO string
  oraFinal: string; // ISO string
  medic?: Medic;
  locatie?: Locatie;
}

export interface Pacient {
  id: ID;
  userId: ID;
  cnp: string;
}

export interface Programare {
  id?: ID;
  dataProgramare: string; // ISO
  status?: ProgramareStatus;
  observatii?: string;
  pacient?: Pacient;
  pacientId?: ID;
  medic?: Medic;
  medicId?: ID;
  locatie?: Locatie;
  locatieId?: ID;
}

export async function getClinici() {
  const { data } = await api.get<Clinica[]>('/api/clinicas', { params: { size: 1000 } });
  return data;
}

export async function getLocatiiByClinica(clinicaId: ID) {
  // ManyToMany Clinica{locatii} -> pe Locatie se poate filtra cu cliniciId.equals
  const { data } = await api.get<Locatie[]>('/api/locaties', {
    params: { 'cliniciId.equals': clinicaId, size: 1000 },
  });
  return data;
}

export async function getSpecializari() {
  const { data } = await api.get<Specializare[]>('/api/specializares', { params: { size: 1000 } });
  return data;
}

export async function getMedici(filters: { clinicaId?: ID; specializareId?: ID; disponibil?: boolean }) {
  const params: Record<string, any> = { size: 1000 };
  if (filters.clinicaId) params['clinicisId.equals'] = filters.clinicaId;
  if (filters.specializareId) params['specializarisId.equals'] = filters.specializareId;
  if (typeof filters.disponibil === 'boolean') params['disponibil.equals'] = filters.disponibil;
  const { data } = await api.get<Medic[]>('/api/medics', { params });
  return data;
}

export async function getPrograms(medicId: ID, locatieId: ID) {
  const { data } = await api.get<Program[]>('/api/programs', {
    params: { 'medicId.equals': medicId, 'locatieId.equals': locatieId, size: 1000 },
  });
  return data;
}

export async function getAppointmentsForMedicOnDate(medicId: ID, locatieId: ID, dayStartIso: string, dayEndIso: string) {
  const { data } = await api.get<Programare[]>('/api/programares', {
    params: {
      'medicId.equals': medicId,
      'locatieId.equals': locatieId,
      'dataProgramare.greaterThanOrEqual': dayStartIso,
      'dataProgramare.lessThan': dayEndIso, // interval [start, end)
      size: 1000,
    },
  });
  return data;
}

export async function getCurrentPacientByUserId(userId: ID) {
  const { data } = await api.get<Pacient[]>('/api/pacients', { params: { 'userId.equals': userId, size: 1 } });
  return data?.[0];
}

export async function getMyAppointments(pacientId: ID) {
  const { data } = await api.get<Programare[]>('/api/programares', {
    params: { 'pacientId.equals': pacientId, size: 1000, sort: ['dataProgramare,asc'] },
  });
  return data;
}

export async function createAppointment(
  p: Required<Pick<Programare, 'pacientId' | 'medicId' | 'locatieId' | 'dataProgramare'>> & Partial<Programare>,
) {
  const payload: Programare = {
    dataProgramare: p.dataProgramare,
    status: ProgramareStatus.ACTIVA,
    observatii: p.observatii ?? '',
    pacientId: p.pacientId,
    medicId: p.medicId,
    locatieId: p.locatieId,
  };
  const { data } = await api.post<Programare>('/api/programares', payload);
  return data;
}

export async function updateAppointment(id: ID, patch: Partial<Programare>) {
  const body = { id, ...patch }; // <— include ID în body
  const res = await axios.patch<Programare>(`/api/programares/${id}`, body, {
    headers: { 'Content-Type': 'application/merge-patch+json' },
  });
  return res.data;
}

export async function cancelAppointment(id: ID) {
  // ajustează numele exact al valorii din enum dacă diferă
  return updateAppointment(id, { id, status: ProgramareStatus.ANULATA as any });
}
