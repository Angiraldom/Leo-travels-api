import { typeRoles } from '../constant/fieldsValidation.constant';

export interface IUser {
  _id?: string;
  name: string;
  lastName?: string;
  password: string;
  email: string;
  typeDocument: string;
  numberDocument: string;
  role: typeRoles;
  municipalityDepartament?: string;
  residenceAddress?: string;
  codePostal?: string;
  phone?: string;
  createdAt?: Date;
}
