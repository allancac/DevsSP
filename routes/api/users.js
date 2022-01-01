const express = require('express');
const router = express.Router();
const User = require('../../models/User');  //Carregar o modelo de usuário - User
const bcrypt = require('bcryptjs');   //Biblioteca para criptografar a senha do ususário
const gravatar = require('gravatar'); //Biblioteca para obter imagem do avatar do e-mail fornecido
const {check, validationResult} = require('express-validator') //Biblioteca do validador nativo do ExpressJS

//  Regras de validação da rota POST api/users
const validacaoRegistroUsuario = [
  check('nome', 'Forneça o nome completo do usuário').not().isEmpty(),
  check('email', 'Forneça um e-mail válido').isEmail(),
  check('senha', 'Forneça uma senha com 6 ou mais caracteres').isLength({min:6}),
  check('senha2', 'Confirme a senha').not().isEmpty(),
  check('senha2', 'As senhas não conferem').exists().custom((senha2, { req }) => senha2 === req.body.senha)
]

// @route   POST api/users
// @desc    Rota para registrar usuario
// @access  Public
router.post('/',validacaoRegistroUsuario,(req, res) => {
  const erros = validationResult(req)
  if(erros.isEmpty()){
    User.findOne({ email: req.body.email })
    .then(user => {

      if (user) {
        return res.status(400).json("Usuário já cadastrado.");  // Resposta HTTP com objeto indicando o erro 
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
              .then(res.status(200).json({msg:"Usuário cadastrado"}))   // Resposta HTTP com o usuário criado no banco de dados MONGODB
              .catch(err => console.log(err))
          })
        });
      }
    })
    .catch(err => console.log(err))
  }else{
    res.status(400).json({erros:erros.array()})
  }
  
});

module.exports = router;
