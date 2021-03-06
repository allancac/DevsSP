const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Cria um esquema
const UserSchema = new Schema({

  nome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  senha: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }

})

const User = mongoose.model('users', UserSchema)

module.exports = User