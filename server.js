const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');  // Importa o módulo passport
const connectDB = require('./config/db');

// Body Parser MiddleWare
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Conexão com o banco de dados MongoDB
connectDB();

// MiddleWare do Passport 
app.use(passport.initialize()) // Inicializa o Passport no servidor "app"
// chamada ao método, passando como parâmetro a variável pass( referência ao módulo  passport)
require('./config/passport')(passport);

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