const express = require('express');
const mongoogse = require('mongoose');

const app = express();

// DB config
const db = require('./config/keys').mongoDBURI;

// Connect to MongoDB
mongoogse
  .connect(db)
  .then(() => {
    console.log("Conectado ao banco de dados");
  })
  .catch(err => { console.log(err) });

app.get('/', (req, res) => {
  res.send("Servidor Online!");

});

//APIs routes
const auth = require('./routes/api/auth');
const posts = require('./routes/api/posts');
const profile = require('./routes/api/profile');

app.use('/api/auth', auth);
app.use('/api/posts', posts);
app.use('/api/profile', profile);

const port = 5000 || process.env.PORT
app.listen(port, () => {
  console.log(`Servidor funcionando na porta ${port}.`)

});