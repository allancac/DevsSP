const express = require('express');
const router = express.Router();
const User = require('../../models/User');  //Carregar o modelo de usuário - User
const bcrypt = require('bcryptjs');   //Biblioteca para criptografar a senha do ususário
const gravatar = require('gravatar'); //Biblioteca para obter imagem do avatar do e-mail fornecido
const registerValidation = require('../../validation/register_validation')


// @route   POST api/users
// @desc    Rota para registrar usuario
// @access  Public
router.post('/', (req, res) => {
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
          // Criptografa a senha do usuário para salvar no banco de dados
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

module.exports = router;
