const express = require('express');
const app = express();
const passport = require('passport');  // Importa o módulo passport
const connectDB = require('./config/db');

// MiddleWare do Body Parser nativo do ExpressJS
app.use(express.json({ extended: false }));

// Conexão com o banco de dados MongoDB
connectDB();

// MiddleWare do Passport 
app.use(passport.initialize()) // Inicializa o Passport no servidor "app"
// chamada ao método, passando como parâmetro a variável pass( referência ao módulo  passport)
require('./config/passport')(passport);

//Importação das rotas da API
const users = require('./routes/api/users');
const auth = require('./routes/api/auth');
const posts = require('./routes/api/posts');
const profile = require('./routes/api/profile');

// Disponibilização das rotas pelo servidor 
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/posts', posts);
app.use('/api/profile', profile);

// Server Listening Service
const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Servidor funcionando na porta ${port}.`)

});