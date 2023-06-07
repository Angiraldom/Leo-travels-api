import { Document } from 'mongoose';
import { typeRoles } from '../constant/fieldsValidation.constant';

export interface IUser extends Document {
  name?: string;
  lastName?: string;
  password?: string;
  email?: string;
  typeDocument?: string;
  numberDocument?: number;
  role?: typeRoles;
  municipalityDepartament?: string;
  residenceAddress?: string;
  codePostal?: number;
  phone?: number;
}
