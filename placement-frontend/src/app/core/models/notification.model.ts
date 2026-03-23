export interface NotificationResponse {
  id: number;
  title: string;
  message: string;
  type: string;
  senderName: string;
  isBroadcast: boolean;
  companyName: string;
  isRead: boolean;
  createdAt: string;
}