const express = require('express');
const router = express.Router();
const gravatar = require('gravatar'); //Biblioteca para obter imagem do avatar do e-mail fornecido
const bcrypt = require('bcryptjs');   //Biblioteca para criptografar a senha do ususário
const jwt = require('jsonwebtoken');  //Biblioteca para gerar Token JWT
const keys = require('../../config/keys')
const User = require('../../models/User');  //Load User Model
const passport = require('passport')
const registerValidation = require('../../validation/register_validation')
const loginValidation = require('../../validation/login_validation')


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
  const { isValid, erros } = registerValidation(req.body);

  if (!isValid) {
    res.status(400).json(erros);
  } else {
    User.findOne({ email: req.body.email })
      .then(user => {
        // Validação do usuário. Aproveitando o objeto "erros" do método registerValidation()
        if (user) {
          erros.email = 'E-mail já cadastrado.' // cria uma key "email" no objeto erros
          return res.status(400).json(erros);  // Resposta HTTP com objeto indicando o erro 
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
              if (err) throw err;
              novoUsuario.senha = hash;
              novoUsuario.save()  // Insere o usuário no banco de dados
                .then(usuario => res.json(usuario))   // Resposta HTTP com o usuário criado no banco de dados MONGODB
                .catch(err => console.log(err))
            })
          });
        }
      }).catch(err => console.log(err))
  }
});

// @route   POST api/auth/login
// @desc    Rota para usuario realizar login / Retornar Token JWT
// @access  Public
router.post('/login', (req, res) => {
  const { isValid, erros } = loginValidation(req.body);

  if (!isValid) {
    res.status(400).json(erros);
  } else {
    const email = req.body.email;
    const senha = req.body.senha;

    // Encontrar usuário pelo e-mail
    User.findOne({ email: email })
      .then(usuario => {
        if (!usuario) {
          erros.email = `O usuário ${email} não existe.`
          return res.status(404).json(erros);
        }

        // Verificar Senha
        bcrypt.compare(senha, usuario.senha) // Retorna uma promisse com um valor boolean
          .then(senhaCorreta => {
            if (senhaCorreta) {
              const payload = {
                id: usuario.id,
                nome: usuario.nome,
                avatar: usuario.avatar
              };

              // Gerar Token
              jwt.sign(payload, keys.appSecret, { expiresIn: 3600 }, (err, newToken) => {
                res.json({ success: true, token: 'Bearer ' + newToken })
              });
            } else {
              erros.senha = "A senha fornecida está incorreta."
              return res.status(400).json(erros);
            };
          })
      })
  }
});

// @route   GET api/auth/current
// @desc    Rota protegida pelo passport para exibir usuario atual login
// @access  Private 
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  function (req, res) {
    res.json(req.user)
  }
);

module.exports = router;
