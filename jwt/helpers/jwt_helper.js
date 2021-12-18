const Jwt = require("jsonwebtoken");

const createError = require("http-errors");

module.exports = {
  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const options = {
        expiresIn: "1h",
        issuer: "yousefmeska.com",
        audience: userId,
      };
      const secret =
        "522158b6f497068639315b302ab846d40d1ef3926621712b646203b12c12eeb5";
      Jwt.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message);
          console.log(`secret: ${secret}`);
          return reject(createError.InternalServerError());
        }
        resolve(token);
      });
    });
  },
  verfiyAccessToken: (req, res, next) => {
    if (!req.headers["authorization"]) return next(createError.Unauthorized());
    const authHeader = req.headers["authorization"];
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];
    const secret =
      "522158b6f497068639315b302ab846d40d1ef3926621712b646203b12c12eeb5";
    Jwt.verify(token, secret, (err, payload) => {
      if (err) {
        return next(createError.Unauthorized());
      }
      req.payload = payload;
      next();
    });
  },
};
