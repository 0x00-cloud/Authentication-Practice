const createError = require("http-errors");
const User = require("../models/User.model");
const { authSchema } = require("../helpers/validation_schema");
const { signAccessToken, signRefershToken } = require("../helpers/jwt_helper");
function authController() {
  return {
    async register(req, res, next) {
      try {
        //const { email, password } = req.body;
        // if (!email || !password) {
        //   throw createError.BadRequest();
        // }
        const result = await authSchema.validateAsync(req.body);

        const doesExist = await User.findOne({ email: result.email });
        if (doesExist) {
          throw createError.Conflict(`${result.email} already exist!`);
        }
        const user = new User({
          email: result.email,
          password: result.password,
        });
        const savedUser = await user.save();
        const accessToken = await signAccessToken(savedUser.id);
        const refreshToken = await signRefershToken(savedUser.id);
        res.send({ accessToken });
      } catch (error) {
        if (error.isJoi === true) error.status = 422;
        next(error);
      }
    },
    async login(req, res, next) {
      try {
        const result = await authSchema.validateAsync(req.body);
        const user = await User.findOne({ email: result.email });
        if (!user) {
          throw createError.NotFound("User not registered");
        }
        const isMatch = await user.isValidPassword(result.password);
        console.log(isMatch);

        if (!isMatch) {
          throw createError.Unauthorized("Username/password not valid");
        }
        const accessToken = await signAccessToken(user.id);
        const refreshToken = await signRefershToken(user.id);
        res.send({ accessToken, refreshToken });
      } catch (error) {
        if (error.isJoi === true) {
          return next(createError.BadRequest("Invalid Username/Password"));
        }
        next(error);
      }
    },
  };
}
module.exports = authController();
