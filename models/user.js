import mongoose from 'mongoose';
import config from '../config';

// eslint-disable-next-line max-len
const connection = mongoose.createConnection(config.mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) {
    console.log('Connected failed');
  }
  console.log('Connected successfully to server');
});

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
  });
};

User.methods.verify = function (password) {
  return this.password === password;
};

User.methods.assignAdmin = function () {
  this.admin = true;
  return this.save();
};

export default connection.model('users', User);
