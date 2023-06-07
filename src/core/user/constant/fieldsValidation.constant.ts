export const TYPE_DOCUMENT: string[] = [
  'CE',
  'CC',
  'DIE',
  'RC',
  'TI',
  'TE',
  'NIT',
  'PP',
  'PEP',
  'NUIP',
  'FOREIGN_NIT',
];

export type typeRoles = 'Admin' | 'Cliente';

export const ROLES: typeRoles[] = ['Admin', 'Cliente'];

export const REQUIRED_PROPERTIES = new Set([
  'name',
  'lastName',
  'email',
  'typeDocument',
  'numberDocument',
  'rol',
  'municipalityDepartament',
  'residenceAddress',
  'codePostal',
  'phone',
  'status',
]);
