const jwt = require('jsonwebtoken');
const User = require("../models/UserModel");
const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({error: 'Authentication token is required'});
    }

    try {
        // Verify the JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch the user from the database
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({error: 'User not found'});
        }

        // Attach the user to the request object
        req.user = user;
        next();
    } catch (error) {
        console.error('Token verification error:', error.message); // Log errors for debugging
        res.status(403).json({error: 'Invalid token'}); // Respond with an invalid token error
    }
};

module.exports = authenticate;
