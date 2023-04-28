import { IRequestResponse } from '../interface/IRequestResponse.interface';

export const buildResponseCreate = ({
  data,
  msg,
  state,
}: IRequestResponse): IRequestResponse => {
  return {
    data: data || {},
    msg:
      msg ||
      'The request was successful and as a result a new resource was created.',
    state: state ?? true,
    code: 201,
  };
};

export const buildResponseSuccess = ({
  data,
  msg,
  state,
}: IRequestResponse): IRequestResponse => {
  return {
    data: data || {},
    msg: msg || 'The request was successful.',
    state: state ?? true,
    code: 200,
  };
};

export const buildResponseFail = ({
  data,
  msg,
  state,
}: IRequestResponse): IRequestResponse => {
  return {
    data: data || {},
    msg: msg || 'An error has ocurred in the application, we apoligize.',
    state: state ?? false,
    code: 400,
  };
};

export const buildResponseUnauthorized = ({
  data,
  msg,
  state,
}: IRequestResponse): IRequestResponse => {
  return {
    data: data || {},
    msg: msg || 'User not authorized to make this request.',
    state: state ?? false,
    code: 401,
  };
};

export const buildResponseNotFound = ({
  data,
  msg,
  state,
}: IRequestResponse): IRequestResponse => {
  return {
    data: data || {},
    msg: msg || 'The server cannot find the request resource.',
    state: state ?? false,
    code: 404,
  };
};
