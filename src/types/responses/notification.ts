import { Resp } from './base';
import { Notification, NotificationSummary } from '../notification';

export interface GetNotificationsResp extends Resp {
  data?: Notification[];
}

export interface PushNewNotification {
  data: NotificationSummary;
}
