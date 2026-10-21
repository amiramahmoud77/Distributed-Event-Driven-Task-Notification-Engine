export class NotificationService {
  static async sendNotification(event: string, payload: any) {
    console.log(`[NOTIFICATION SERVICE] Event received: ${event}`);
    console.log(`Payload data:`, payload);
    console.log(`Notification sent successfully for task ID: ${payload.taskId}`);
  }
}