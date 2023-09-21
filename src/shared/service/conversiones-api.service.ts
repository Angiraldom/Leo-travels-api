import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Request } from 'express';
import configuration from '../../config';
import { ITypeEvents } from '../utils/interface/ITypeEvents.interface';

@Injectable()
export class ConversionesService {
  constructor(
    @Inject(configuration.KEY) private config: ConfigType<typeof configuration>,
  ) {}

  purchaseEvent(request: Request, value: number) {
    'use strict';
    const bizSdk = require('facebook-nodejs-business-sdk');
    const ServerEvent = bizSdk.ServerEvent;
    const EventRequest = bizSdk.EventRequest;
    const UserData = bizSdk.UserData;
    const CustomData = bizSdk.CustomData;

    const access_token = this.config.facebook.accessToken;
    const pixel_id = this.config.facebook.pixelId;
    const api = bizSdk.FacebookAdsApi.init(access_token);

    let current_timestamp = Math.floor(Date.now() / 1000);

    const userData_0 = new UserData()
    .setClientIpAddress(request.ip)
    .setClientUserAgent(request.headers['user-agent']);

    const customData_0 = new CustomData().setValue(value).setCurrency('COP');
    const serverEvent_0 = new ServerEvent()
      .setEventName('Purchase')
      .setEventTime(current_timestamp)
      .setUserData(userData_0)
      .setCustomData(customData_0)
      .setActionSource('website');

    const eventsData = [serverEvent_0];
    const eventRequest = new EventRequest(access_token, pixel_id).setEvents(
      eventsData,
    );
    eventRequest.execute();
  }

  async sendStandardEvent(request: Request, eventName: ITypeEvents) {
    const bizSdk = require('facebook-nodejs-business-sdk');
    const ServerEvent = bizSdk.ServerEvent;
    const EventRequest = bizSdk.EventRequest;
    const UserData = bizSdk.UserData;

    const access_token = this.config.facebook.accessToken;
    const pixel_id = this.config.facebook.pixelId;
    const api = bizSdk.FacebookAdsApi.init(access_token);

    let current_timestamp = Math.floor(Date.now() / 1000);

    const userData_0 = new UserData()
      .setClientIpAddress(request.ip)
      .setClientUserAgent(request.headers['user-agent']);

    const serverEvent_0 = new ServerEvent()
      .setEventName(eventName)
      .setEventTime(current_timestamp)
      .setUserData(userData_0)
      .setActionSource('website')
      .setDataProcessingOptionsCountry(0)
      .setDataProcessingOptionsState(0);

    const eventsData = [serverEvent_0];
    const eventRequest = new EventRequest(access_token, pixel_id).setEvents(
      eventsData,
    );
    eventRequest.execute();
  }
}
