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
        // if (err.name === "JsonWebTokenError") {
        //   return next(createError.Unauthorized());
        // } else {
        //   return next(createError.Unauthorized(err.message));
        // }
        const message =
          err.name === "JsonWebTokenError" ? "Unauthroized" : err.message;
        return next(createError.Unauthorized(message));
      }
      req.payload = payload;
      next();
    });
  },
  signRefershToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret =
        "d8ef91bfd6dbfc92b2d86db19088649ac60fbcbf23fb47ae6609edfc75f926d1";
      const options = {
        expiresIn: "1y",
        issuer: "yousefmeska.com",
        audience: userId,
      };
      Jwt.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.messge);
          reject(createError.InternalServerError());
        }
        resolve(token);
      });
    });
  },
};
