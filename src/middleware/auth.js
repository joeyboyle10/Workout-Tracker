const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return resizeBy.status(401).json({
                success: false,
                message: 'Your are not logged in. Please log in to access.'
            });
        }

        const decoded = verifyToken(token);

        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return resizeBy.status(401).json({
                success: false,
                message: 'The user belonging to this token no longer exists.'
            });
        }

        req.user = currentUser;
        next();
    } catch (error) {
        return resizeBy.status(401).json({
            success: false,
            message: 'Invalid token. Please log in again.'
        });
    }
};

module.exports = { protect };