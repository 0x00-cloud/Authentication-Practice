const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});
async function generateHash(password, salt) {
  return bcrypt.hash(password, salt);
}
userSchema.pre("save", async function preSave(next) {
  try {
    const user = this;
    if (user.isNew) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await generateHash(user.password, salt);
      user.password = hashedPassword;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const User = model("User", userSchema);

module.exports = User;
