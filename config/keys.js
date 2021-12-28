// Constantes com as variáveis de ambiente que armazenam senhas e secrets
const mongoUser = process.env.MONGO_USER
const mongoPassword = process.env.MONGO_PASSWORD
const appSecret = process.env.APP_SECRET

// 
module.exports = {
  mongoDBURI: `mongodb+srv://${mongoUser}:${mongoPassword}@cluster0.3fd9f.mongodb.net/devsp`,
  appSecret: `${appSecret}`
}