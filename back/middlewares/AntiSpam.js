const antiSpam = new Map();

const preventSpam = (req, res, next) => {
    const userId = req.user.id;
    const now = Date.now();

    if (antiSpam.has(userId) && now - antiSpam.get(userId) < 2000) {
        return res.status(429).json({ error: 'Please wait before sending another message' });
    }

    antiSpam.set(userId, now);
    next();
};

module.exports = preventSpam;
