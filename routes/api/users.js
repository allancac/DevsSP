const express = require('express');
const router = express.Router();
const User = require('../../models/User');  //Carregar o modelo de usuário - User
const bcrypt = require('bcryptjs');   //Biblioteca para criptografar a senha do ususário
const gravatar = require('gravatar'); //Biblioteca para obter imagem do avatar do e-mail fornecido
const {check, validationResult} = require('express-validator') //Biblioteca do validador nativo do ExpressJS
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')

//  Regras de validação da rota POST api/users
const validacaoRegistroUsuario = [
  check('nome', 'Digite o nome completo do usuário').not().isEmpty(),
  check('email', 'Digite um e-mail válido').isEmail(),
  check('senha', 'Digite uma senha com 6 ou mais caracteres').isLength({min:6}),
  check('senha2', 'Confirme a senha').not().isEmpty(),
  check('senha2', 'As senhas não conferem').exists().custom((senha2, { req }) => senha2 === req.body.senha)
]

// @route   POST api/users
// @desc    Rota para registrar usuario
// @access  Public
router.post('/', validacaoRegistroUsuario, 
  async (req, res) => {
    /** Validação dos dados fornecidos pelo client da API */

    // Cria objeto com erros gerados pelo validator do ExpressJS
    const erros = validationResult(req)
    //Se existir erro, retorna status de erro e o objeto gerado pelo validador do ExpressJS
    if(!erros.isEmpty()){
      res.status(400).json({erros:erros.array()})
    }else{
      // Destructuring assignment para criar variáveis com os campos do corpo da requisição.
      const {nome, email, senha} = req.body;
      try{
        // função assíncrona AWAIT com o usuário consultado no Banco de Dados MongoDB
        let usuario = await User.findOne({ email })
        // Testa se o usuário já existe no banco de Dados MongoDB
        if (usuario) {
          // Resposta HTTP com objeto indicando o erro. Criado uma resposta JSON seguindo o padrão do validador do ExpressJS
          return res.status(400).json({erros:[{msg:"Usuário já cadastrado."}]});  
        } else {
          // Cria um avatar de acordo com o e-mail passado no body da requisição POST
          const avatar = gravatar.url(email, {
            s: '200', // tamanho
            r: 'pg', // classificação
            d: 'mm' // imagem de avatar padrão

          })

          // Cria uma instância do Model User
          const novoUsuario = new User({nome,email,avatar,senha});

          // Criptografa a senha do usuário para salvar no banco de dados
          const salt = await bcrypt.genSalt(10)  // Cria um "salt" com a senha fornecida
          const hash = await bcrypt.hash(senha, salt) // Criptografa o salt gerado com a senha
          novoUsuario.senha = hash;
          await novoUsuario.save()  // Insere o usuário no banco de dados

          const payload = {
            id: novoUsuario.id,
            email: novoUsuario.email,
          };

          // Gerar Token
          jwt.sign(payload, keys.appSecret, { expiresIn: 3600 }, (err, newToken) => {
            // Resposta HTTP com o usuário criado no banco de dados MONGODB
            res.status(200).json({ msg: "Usuário criado com sucesso", token: 'Bearer ' + newToken })  
            
          });
            
        }
    

      }catch(erro){
        console.log(erro.message);
        res.status(500).send("Erro no servidor")
      }

    }
    

  }
);

module.exports = router;
