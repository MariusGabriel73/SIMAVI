import { IClinicaMedApp } from 'app/shared/model/clinica-med-app.model';

export interface ILocatieMedApp {
  id?: number;
  oras?: string | null;
  adresa?: string | null;
  codPostal?: string | null;
  clinicis?: IClinicaMedApp[] | null;
}

export const defaultValue: Readonly<ILocatieMedApp> = {};
