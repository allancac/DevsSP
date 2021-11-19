const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a Schema

const UserSchema = new Schema({

  nome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  senha: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  }

})

module.exports = User = mongoose.model('users', UserSchema)