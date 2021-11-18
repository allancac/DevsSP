const mongoUser = process.env.MONGO_USER
const mongoPassword = process.env.MONGO_PASSWORD
module.exports = {
  mongoDBURI: `mongodb+srv://${mongoUser}:${mongoPassword}@cluster0.3fd9f.mongodb.net/`
}