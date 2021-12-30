const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');   //Biblioteca para criptografar a senha do ususário
const jwt = require('jsonwebtoken');  //Biblioteca para gerar Token JWT
const keys = require('../../config/keys')
const User = require('../../models/User');  //Carregar o modelo de usuário - User
const passport = require('passport')
const loginValidation = require('../../validation/login_validation')


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
