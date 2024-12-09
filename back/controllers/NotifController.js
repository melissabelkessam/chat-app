const Notification = require('../models/NotificationModel');

const pushNotification = async (req, res) => {
    const { userId, message } = req.body;

    try {
        const newNotification = new Notification({ userId, message });
        await newNotification.save();
        res.status(201).json(newNotification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { pushNotification, getUserNotifications };
