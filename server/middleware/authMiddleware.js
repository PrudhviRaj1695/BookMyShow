const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ status:false , message: "Access Denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], JWT_SECRET); 
        req.user = decoded; 
        next(); 
    } catch (error) {
        return res.status(400).json({ status:false , message: "Invalid Token" });
    }
};

module.exports = authMiddleware;
