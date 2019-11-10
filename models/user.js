import * as mongoose from 'mongoose';

const User = new mongoose.Schema({
  username: String,
  password: String,
  admin: { type: Boolean, default: false },
});

User.statics.create = function (username, password) {
  const user = new this({
    username,
    password,
  });

  return user.save();
};

User.statics.findOneByUsername = function (username) {
  return this.findOne({
    username,
  }).exec();
};

User.methods.verify = function (password) {
  return this.password === password;
};

User.methods.assignAdmin = function () {
  this.admin = true;
  return this.save();
};

export default mongoose.model('users', User);
