import mongoose from 'mongoose';
import crypto from 'crypto';
import config from '../config';

// eslint-disable-next-line max-len
const connection = mongoose.createConnection(config.mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) {
    console.log('Connected failed');
  }
  console.log('Connected successfully to server');
});

const User = new mongoose.Schema({
  username: { type: String, required: true },
  password: String,
  admin: { type: Boolean, default: false },
});

User.statics.create = function (username, password) {
  const encrypted = crypto.createHmac('sha1', config.secret)
    .update(password)
    .digest('base64');
  const user = new this({
    username,
    password: encrypted,
  });

  return user.save();
};

User.statics.findOneByUsername = function (username) {
  return this.findOne({
    username,
  });
};

User.methods.vertify = function (password) {
  const encrypted = crypto.createHmac('sha1', config.secret)
    .update(password)
    .digest('base64');
  return this.password === encrypted;
};

User.methods.assignAdmin = function () {
  this.admin = true;
  return this.save();
};

export default connection.model('users', User);
