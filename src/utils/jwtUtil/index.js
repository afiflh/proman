const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config/env");

exports.generateToken = (payload) => {
  const newToken = jwt.sign({ ...payload }, JWT_SECRET, { expiresIn: "1d" });
  return newToken;
};

exports.verifyToken = (token) => {
  const decoded = jwt.verify(token, JWT_SECRET);
  return decoded;
};
