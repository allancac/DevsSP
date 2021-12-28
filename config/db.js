const mongoose = require('mongoose')
// configuração do Banco de Dados
const db = require('./keys').mongoDBURI; //mongoDBURI é String com a conexão ao MongoDB

// Função assíncrona para conexão ao Banco de Dados
const connectDB = async () => {
  try {
    await mongoose.connect(db)
    console.log(`Conectado ao MongoDB`)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

module.exports = connectDB