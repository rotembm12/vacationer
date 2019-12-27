const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      trim: true
   },
   password: {
      type: String,
      required: true,
      minlength: 4,
      trim: true
   },
   email: {
      type: String,
      required: true,
      lowercase: true
   },
   isAdmin: {
      type: Boolean,
      default: false
   }
});

userSchema.methods.toJSON = function() {
   const user = this;
   const userObject = user.toObject();

   delete userObject.password;
   return userObject;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
