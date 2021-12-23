const Jwt = require("jsonwebtoken");
const client = require("./init.redis");
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
    const secret = process.env.ACCESS_TOKEN_SECRET;
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
      const secret = process.env.REFRESH_TOKEN_SECRET;
      console.log(`refreshToken: ${process.env.REFRESH_TOKEN_SECRET}`);
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

        //resolve(token); when using redis when don't need to pass the token directly back, instead save it using redis
        client.set(userId, token, "EX", 365 * 24 * 60 * 60, (err) => {
          if (err) {
            console.log(err.message);
            reject(createError.InternalServerError()); //don't send what actually happend to the client.
            return;
          }
          resolve(token);
        });
      });
    });
  },
  verfiyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      Jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, payload) => {
          if (err) {
            return reject(createError.Unauthorized());
          }
          const userId = payload.aud;
          client.get(userId, (err, result) => {
            if (err) {
              console.log(err.message);
              reject(createError.InternalServerError());
              return;
            }
            if (refreshToken === result) {
              resolve(userId);
            } else {
              reject(createError.Unauthorized());
            }
          });
        }
      );
    });
  },
};

//payload contains the short form of names (audience => a)
