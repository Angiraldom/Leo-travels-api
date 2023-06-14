import { IRequestResponse } from '../interface/IRequestResponse.interface';
import { Request } from 'express';
import { HttpException } from '@nestjs/common';
import { IErrorResponse } from '../interface/IErrorResponse.interface';

export const buildResponseSuccess = ({
  data,
  msg,
  code = 200,
}: IRequestResponse): IRequestResponse => {
  return {
    data: data || {},
    msg: msg || 'The request was successful.',
    code,
  };
};

const defaultError = (
  exception: HttpException,
  request: Request,
): IErrorResponse => {
  return {
    timestamp: new Date().toISOString(),
    path: request.url,
    exceptionMessage: exception.message,
    typeException: exception.name,
    statusCode: 500,
    customMessage: 'Something is wrong.',
    tag: 'ErrorServer',
  };
};

export const BuildReponseError = (
  exception: HttpException,
  request: Request,
): IErrorResponse => {
  if (!exception.getStatus) {
    return defaultError(exception, request);
  }
  return {
    ...defaultError(exception, request),
    statusCode: exception.getStatus(),
    customMessage: exception.getResponse()['customMessage'],
    tag: exception.getResponse()['tag'],
  };
};
