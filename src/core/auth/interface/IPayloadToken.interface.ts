import { typeRoles } from '../../user/constant/fieldsValidation.constant';

export interface IPayloadToken {
  role: typeRoles;
  sub: string;
  iat?: number;
  exp?: number;
}
