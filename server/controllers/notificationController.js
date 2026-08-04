const notificationService = require("../services/notificationService");

class NotificationController {
  async getMyNotifications(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;

      const data = await notificationService.getUserNotifications(
        req.user.id,
        page,
        limit,
      );
      res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async markAsRead(req, res, next) {
    try {
      const { id } = req.params;
      const updatedNotification = await notificationService.markAsRead(
        id,
        req.user.id,
      );
      res.json(updatedNotification);
    } catch (err) {
      next(err);
    }
  }

  async markAllAsRead(req, res, next) {
    try {
      const result = await notificationService.markAllAsRead(req.user.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async clearAllNotifications(req, res, next) {
    try {
      const result = await notificationService.clearAllNotifications(
        req.user.id,
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async sendBroadcast(req, res, next) {
    try {
      const { title, message, link } = req.body;
      const result = await notificationService.sendSystemBroadcast({
        title,
        message,
        link,
        senderId: req.user.id,
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new NotificationController();
