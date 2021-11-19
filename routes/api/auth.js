const express = require('express');
const router = express.Router();
const gravatar = require('gravatar'); //Biblioteca para obter imagem do avatar do e-mail fornecido
const bcrypt = require('bcryptjs');   //Biblioteca para criptografar a senha do ususário

//Load User Model
const User = require('../../models/User');


// @route   GET api/auth/test
// @desc    Testa a rota auth
// @access  Public
router.get('/test', (req, res) => {
  const resposta = {
    usuario: 'user',
    email: 'user@email.com'
  };
  res.json(resposta);
});

// @route   POST api/auth/register
// @desc    Rota para registrar usuario
// @access  Public

router.post('/register', (req, res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        return res.status(400).json({ email: 'E-mail já cadastrado.' });
      } else {
        // Cria um avatar de acordo com o e-mail passado no body da requisição POST
        const avatar = gravatar.url(req.body.email, {
          s: '200', // tamanho
          r: 'pg', // classificação
          d: 'mm' // imagem de avatar padrão

        })

        // Cria uma instância do Model User
        const novoUsuario = new User({
          nome: req.body.nome,
          email: req.body.email,
          avatar,
          senha: req.body.senha
        });

        bcrypt.genSalt(10, (err, salt) => {  // Cria um "salt" com a senha fornecida
          bcrypt.hash(novoUsuario.senha, salt, (err, hash) => { // Criptografa o salt gerado com a senha
            // if (err) throw err;
            novoUsuario.senha = hash;
            novoUsuario.save()  // Insere o usuário no banco de dados
              .then(usuario => res.json(usuario))
              .catch(err => console.log(err))
          })
        });
      }
    })
});



module.exports = router;
