const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');   //Biblioteca para criptografar a senha do ususário
const jwt = require('jsonwebtoken');  //Biblioteca para gerar Token JWT
const keys = require('../../config/keys')
const User = require('../../models/User');  //Carregar o modelo de usuário - User
const passport = require('passport')
const {check, validationResult} = require('express-validator') //Biblioteca do validador nativo do ExpressJS

//  Regras de validação da rota POST api/auth
const validacaoLoginUsuario = [
  check('email', 'Digite um e-mail válido').isEmail(),
  check('senha', 'Digite a senha do usuário').not().isEmpty(),
]

// @route   POST api/auth/login
// @desc    Rota para usuario realizar login / Retornar Token JWT
// @access  Public
router.post('/login', validacaoLoginUsuario, async (req, res) => {

  // Cria objeto com erros gerados pelo validator do ExpressJS
  const erros = validationResult(req)
  //Se existir erro, retorna status de erro e o objeto gerado pelo validador do ExpressJS
  if(!erros.isEmpty()){
    res.status(400).json({erros:erros.array()})
  }else{
    // Destructuring assignment para criar variáveis com os campos do corpo da requisição.
    const {email, senha} = req.body;
  
    // Encontrar usuário pelo e-mail
    const usuario = await User.findOne({email})
      
    if (!usuario) {
      return res.status(404).json({erros:[{msg:"Usuário não encontrado."}]});
    }

    // Verificar Senha
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha) // Retorna uma promisse com um valor boolean
    if (senhaCorreta) {
      const payload = {
        id: usuario.id,
        email: usuario.email,
      };
      // Gerar Token
      jwt.sign(payload, keys.appSecret, { expiresIn: 3600 }, (err, newToken) => {
        res.status(200).json({ msg: 'Usuário encontrado', token: 'Bearer ' + newToken })
      });
    } else {
      return res.status(401).json({erros:[{msg:"A senha fornecida está incorreta."}]});
    };
      
      
  }
  }
);

// @route   GET api/auth/current
// @desc    Rota protegida pelo passport para exibir usuario atual login
// @access  Private 
router.get('/current',passport.authenticate('jwt', { session: false }), (req, res) =>{
    res.json(req.user)
  }
);

module.exports = router;
