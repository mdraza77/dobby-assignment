const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  // Get token from header (Laravel's Authorization Bearer token)
  const token = req.header("x-auth-token");

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Add user from payload to request object
    req.user = decoded;
    next(); // Move to the next function (Controller)
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = auth;
