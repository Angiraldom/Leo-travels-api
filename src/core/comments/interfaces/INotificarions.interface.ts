export interface INotifications {
  comment: string;

  creator: string;

  userCreatorComment: string;

  seenBy?: string[];

  isAnswer?: boolean;

  answer?: string;

  createdAt?: Date;
}
