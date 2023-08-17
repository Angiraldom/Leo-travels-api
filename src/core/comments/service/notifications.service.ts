import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { buildResponseSuccess } from 'src/shared/utils/utilities/Response.util';
import { Notification } from '../schema/notification.schema';
import { INotifications } from '../interfaces/INotificarions.interface';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
  ) {}

  async create(payload: INotifications) {
    const body = new this.notificationModel({
      ...payload,
      comment: payload.comment.toString()
    });
    await body.save();

    return buildResponseSuccess({
      data: 'Guardado exitosamente',
    });
  }

  async notificationsAdmin(idUser: string, limit: number, offset: number) {
    const notifications = await this.notificationModel
      .find({
        userCreatorComment: { $ne: idUser },
        creator: { $ne: idUser },
      })
      .skip(limit * offset)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate([
        { path: 'comment' },
        { path: 'creator' },
        { path: 'userCreatorComment' },
      ]);

    return buildResponseSuccess({
      data: notifications,
      totalRecords: await this.notificationModel
      .find({
        userCreatorComment: { $ne: idUser },
        creator: { $ne: idUser },
      }).count()
    });
  }

  async notificationsUser(idUser: string, limit: number, offset: number) {
    const notifications = await this.notificationModel
      .find({
        userCreatorComment: idUser,
        creator: { $ne: idUser },
      })
      .skip(limit * offset)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate([
        { path: 'comment' },
        { path: 'creator' },
        { path: 'userCreatorComment' },
      ]);

    return buildResponseSuccess({
      data: notifications,
      totalRecords: await this.notificationModel.find({
        userCreatorComment: idUser,
        creator: { $ne: idUser },
      }).count()
    });
  }

  async seenNotificationsUser(idUser: string) {
    await this.notificationModel.updateMany(
      {
        userCreatorComment: idUser,
        creator: { $ne: idUser },
      },
      {
        $push: {
          seenBy: idUser,
        },
      },
    );

    return buildResponseSuccess({
      data: 'Actualizado correctamente',
    });
  }

  async seenNotificationsAdmin(idUser: string) {
    await this.notificationModel.updateMany(
      {
        userCreatorComment: { $ne: idUser },
        creator: { $ne: idUser },
      },
      {
        $push: {
          seenBy: idUser,
        },
      },
    );

    return buildResponseSuccess({
      data: 'Actualizado correctamente',
    });
  }

  async removeNotificationsComments(idComment: string) {
    await this.notificationModel.deleteMany({
      comment: idComment
    });

    return buildResponseSuccess({
      data: 'Eliminado exitosamente',
    });
  }

  async removeNotificationsAnswers(idAnswer: string) {
    await this.notificationModel.deleteMany({
      answer: idAnswer
    });

    return buildResponseSuccess({
      data: 'Eliminado exitosamente',
    });
  }
}
