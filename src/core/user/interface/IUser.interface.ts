import { Document } from 'mongoose';

export interface IUser extends Document {
  name?: string;
  lastName?: string;
  password?: string;
  email?: string;
  typeDocument?: string;
  numberDocument?: number;
  rol?: string;
  municipalityDepartament?: string;
  residenceAddress?: string;
  codePostal?: number;
  phone?: number;
}
