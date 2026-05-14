/**
 * JWT Auth Middleware
 * Verifies Bearer token from Authorization header
 * Attaches decoded user to req.user
 */
const jwt  = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    // 1. Extract token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      const message =
        err.name === "TokenExpiredError" ? "Token has expired" : "Invalid token";
      return res.status(401).json({ success: false, message });
    }

    // 3. Find user (exclude password)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: "User no longer exists" });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "Account has been deactivated" });
    }

    // 4. Attach user to request
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Role-based access control middleware
 * Usage: authorize("admin") or authorize("admin", "teacher")
 */
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: `Role '${req.user.role}' is not authorized to access this route`,
    });
  }
  next();
};

module.exports = { protect, authorize };
