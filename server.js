const express = require('express');
const app = express();
const mongoogse = require('mongoose');
const bodyParser = require('body-parser')

// Body Parser MiddleWare
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

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

// Server Listening Service
const port = 5000 || process.env.PORT
app.listen(port, () => {
  console.log(`Servidor funcionando na porta ${port}.`)

});