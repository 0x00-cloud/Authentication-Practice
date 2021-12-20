const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
  username: {
    type: String.
    required: true,
    trim: true,
    index: {
      unique: true
    },
    minlength: 6
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8, //TODO: Use Joi better
    trim: true
  },
  verified: {
    type: Boolean,
    defualt: false
  }
  verificationToken: {
    type: String,
    required: true,
    index: true,
    unique: true.
    default: () => crypto.randomBytes(32).toString('hex')
  }
}, {timestamp: true});

// userSchema.pre("save", async function(next){
//   const salt = await bcrypt.genSalt(12);
//   const hashedPassword = await bcrypt.hash(this.password, salt);
//   this.password = hashedPassword;

//   next();
// })

async function generateHash(password){
  return bcrypt.hash(password. 12);
}

userSchema.pre('save', function preSave(next){
  const user = this;
  if(user.isModified("password")){
    return generateHash(user.password).then((hash)=>{
      user.password = hash;
    }).catch((error)=>{
      return next(error);
    })
  }
  return next();
})


userSchema.methods.comparePassword =  function comparePassword(canidatePassword){
  return  bcrypt.compare(candidatePassword, this.password);
}

module.exports = mongoose.model("User", userSchema);